// src/Resources/app/administration/src/module/contact-person/page/contact-person-create/index.js
import template from './contact-person-create.html.twig';

const { Component, Mixin } = Shopware;

Component.register('contact-person-create', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('notification')
    ],

    data() {
        return {
            contactPerson: null,
            isLoading: false,
            processSuccess: false,
            repository: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        // No computed validation for now - let Shopware handle it
    },

    created() {
        this.repository = this.repositoryFactory.create('maxtllc_contact_person');
        this.getContactPerson();
    },

    methods: {
        getContactPerson() {
            // Create a new contact person entity
            this.contactPerson = this.repository.create(Shopware.Context.api);

            // In Vue 3, we need to ensure the entity is properly reactive
            // Set initial values directly
            this.contactPerson.firstName = '';
            this.contactPerson.lastName = '';
            this.contactPerson.email = '';
            this.contactPerson.phone = '';
            this.contactPerson.active = true;

            console.log('Created contact person:', this.contactPerson);
        },

        onClickSave() {
            // More explicit validation
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

            console.log('Saving contact person:', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: this.contactPerson.phone,
                active: this.contactPerson.active
            });

            this.repository
                .save(this.contactPerson, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;

                    this.createNotificationSuccess({
                        title: this.$t('contact-person.detail.successTitle'),
                        message: this.$t('contact-person.detail.successMessage')
                    });

                    // Navigate to detail page
                    this.$router.push({
                        name: 'contact.person.detail',
                        params: { id: this.contactPerson.id }
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
        }
    }
});