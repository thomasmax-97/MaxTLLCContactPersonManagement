// src/Resources/app/administration/src/module/contact-person/page/contact-person-detail/index.js
import template from './contact-person-detail.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('contact-person-detail', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder')
    ],

    data() {
        return {
            contactPerson: null,
            isLoading: false,
            processSuccess: false,
            repository: null,
            customerRepository: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(this.identifier)
        };
    },

    computed: {
        identifier() {
            return this.contactPerson?.firstName && this.contactPerson?.lastName
                ? `${this.contactPerson.firstName} ${this.contactPerson.lastName}`
                : '';
        },

        contactPersonId() {
            return this.$route.params.id;
        },

        customerCriteria() {
            const criteria = new Criteria();
            criteria.addSorting(Criteria.sort('firstName', 'ASC'));
            return criteria;
        },

        // Computed property to get customer display name
        customerDisplayName() {
            if (!this.contactPerson?.customer) {
                return this.$t('contact-person.detail.noCustomerAssigned');
            }

            const customer = this.contactPerson.customer;
            return `${customer.customerNumber} - ${customer.firstName} ${customer.lastName}`;
        }
    },

    created() {
        this.repository = this.repositoryFactory.create('maxtllc_contact_person');
        this.customerRepository = this.repositoryFactory.create('customer');
        this.getContactPerson();
    },

    methods: {
        getContactPerson() {
            this.isLoading = true;

            const criteria = new Criteria();
            criteria.addAssociation('customer');

            this.repository
                .get(this.contactPersonId, Shopware.Context.api, criteria)
                .then((entity) => {
                    this.contactPerson = entity;
                    this.isLoading = false;
                })
                .catch(() => {
                    this.isLoading = false;
                    this.createNotificationError({
                        title: 'Error',
                        message: 'Contact person not found'
                    });
                    this.$router.push({ name: 'contact.person.list' });
                });
        },

        onClickSave() {
            // Validate required fields
            const firstName = this.contactPerson.firstName?.trim();
            const lastName = this.contactPerson.lastName?.trim();
            const email = this.contactPerson.email?.trim();

            if (!firstName || !lastName || !email) {
                this.createNotificationError({
                    title: this.$t('contact-person.detail.errorTitle'),
                    message: 'Please fill in all required fields: First Name, Last Name, and Email'
                });
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.createNotificationError({
                    title: this.$t('contact-person.detail.errorTitle'),
                    message: 'Please enter a valid email address'
                });
                return;
            }

            this.isLoading = true;

            this.repository
                .save(this.contactPerson, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;
                    this.getContactPerson();

                    this.createNotificationSuccess({
                        title: this.$t('contact-person.detail.successTitle'),
                        message: this.$t('contact-person.detail.successMessage')
                    });
                })
                .catch((exception) => {
                    this.isLoading = false;
                    console.error('Error saving contact person:', exception);
                    this.createNotificationError({
                        title: this.$t('contact-person.detail.errorTitle'),
                        message: exception.message || 'Failed to save contact person'
                    });
                });
        },

        onCancel() {
            this.$router.push({ name: 'contact.person.list' });
        },

        // Method to open customer details in new tab/window
        openCustomerDetails() {
            if (this.contactPerson?.customer?.id) {
                this.$router.push({
                    name: 'sw.customer.detail',
                    params: { id: this.contactPerson.customer.id }
                });
            }
        }
    }
});