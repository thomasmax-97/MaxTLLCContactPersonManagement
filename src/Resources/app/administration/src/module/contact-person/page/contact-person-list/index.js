// src/Resources/app/administration/src/module/contact-person/page/contact-person-list/index.js
import template from './contact-person-list.html.twig';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('contact-person-list', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('notification')
    ],

    data() {
        return {
            repository: null,
            contactPersons: null,
            isLoading: true,
            sortBy: 'firstName',
            sortDirection: 'ASC',
            naturalSorting: true,
            showDeleteModal: false,
            total: 0
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        contactPersonColumns() {
            return [{
                property: 'firstName',
                dataIndex: 'firstName',
                label: this.$t('contact-person.list.columnFirstName'),
                routerLink: 'contact.person.detail',
                allowResize: true,
                primary: true
            }, {
                property: 'lastName',
                dataIndex: 'lastName',
                label: this.$t('contact-person.list.columnLastName'),
                allowResize: true
            }, {
                property: 'email',
                dataIndex: 'email',
                label: this.$t('contact-person.list.columnEmail'),
                allowResize: true
            }, {
                property: 'phone',
                dataIndex: 'phone',
                label: this.$t('contact-person.list.columnPhone'),
                allowResize: true
            }, {
                property: 'customer.customerNumber',
                dataIndex: 'customer.customerNumber',
                label: this.$t('contact-person.list.columnCustomerNumber'),
                allowResize: true
            }, {
                property: 'customer.firstName',
                dataIndex: 'customer.firstName,customer.lastName',
                label: this.$t('contact-person.list.columnCustomerName'),
                allowResize: true
            }, {
                property: 'active',
                dataIndex: 'active',
                label: this.$t('contact-person.list.columnActive'),
                allowResize: true,
                align: 'center',
                width: '100px'
            }];
        }
    },

    created() {
        this.repository = this.repositoryFactory.create('maxtllc_contact_person');
        this.getList();
    },

    methods: {
        getList() {
            this.isLoading = true;

            const criteria = new Criteria(this.page, this.limit);
            criteria.addAssociation('customer');

            if (this.term) {
                criteria.setTerm(this.term);
            }

            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection, this.naturalSorting));

            this.repository
                .search(criteria, Shopware.Context.api)
                .then((result) => {
                    this.contactPersons = result;
                    this.total = result.total;
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.error('Error loading contact persons:', error);
                    this.isLoading = false;
                    this.createNotificationError({
                        title: 'Error',
                        message: 'Failed to load contact persons'
                    });
                });
        },

        onChangeLanguage() {
            this.getList();
        },

        onDelete(id) {
            this.showDeleteModal = id;
        },

        onCloseDeleteModal() {
            this.showDeleteModal = false;
        },

        onConfirmDelete(id) {
            this.showDeleteModal = false;

            return this.repository.delete(id, Shopware.Context.api).then(() => {
                this.getList();
                this.createNotificationSuccess({
                    title: 'Success',
                    message: 'Contact person deleted successfully'
                });
            }).catch((error) => {
                console.error('Error deleting contact person:', error);
                this.createNotificationError({
                    title: 'Error',
                    message: 'Failed to delete contact person'
                });
            });
        },

        // Required by listing mixin
        onPageChange(data) {
            this.page = data.page;
            this.limit = data.limit;
            this.getList();
        },

        onSortColumn(data) {
            this.sortBy = data.sortBy;
            this.sortDirection = data.sortDirection;
            this.naturalSorting = data.naturalSorting;
            this.getList();
        },

        onRefresh() {
            this.getList();
        },

        getContactPersonColumns() {
            return this.contactPersonColumns;
        }
    }
});