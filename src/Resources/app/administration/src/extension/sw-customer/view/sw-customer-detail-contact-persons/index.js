// src/Resources/app/administration/src/view/sw-customer-detail-contact-persons/index.js

import template from './sw-customer-detail-contact-persons.html.twig';
import './sw-customer-detail-contact-persons.scss';

const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;

Shopware.Component.register('sw-customer-detail-contact-persons', {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('notification')
    ],

    props: {
        customer: {
            type: Object,
            required: true
        },
        customerEditMode: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            // Assigned contact persons for this customer
            assignedContactPersons: null,
            // All available contact persons for assignment
            availableContactPersons: null,
            contactPersonsLoading: false,
            showAssignmentModal: false,
            selectedContactPersons: [],
            selectedContactPersonsData: {} // Store the actual selection data
        };
    },

    computed: {
        contactPersonRepository() {
            return this.repositoryFactory.create('maxtllc_contact_person');
        },

        // Check if customer is valid and has an ID
        hasValidCustomer() {
            return this.customer && this.customer.id;
        },

        // Criteria for contact persons assigned to this customer
        assignedContactPersonCriteria() {
            const criteria = new Criteria();
            if (this.hasValidCustomer) {
                criteria.addFilter(Criteria.equals('customerId', this.customer.id));
            }
            criteria.addSorting(Criteria.sort('firstName', 'ASC'));
            return criteria;
        },

        // Criteria for all contact persons (for assignment modal)
        availableContactPersonCriteria() {
            const criteria = new Criteria();
            // Only show contact persons that are NOT assigned to any customer
            criteria.addFilter(Criteria.equals('customerId', null));
            criteria.addSorting(Criteria.sort('firstName', 'ASC'));
            return criteria;
        },

        contactPersonColumns() {
            return [{
                property: 'firstName',
                dataIndex: 'firstName',
                label: this.$tc('contact-person.list.columnFirstName') || 'First Name',
                allowResize: true,
                primary: true
            }, {
                property: 'lastName',
                dataIndex: 'lastName',
                label: this.$tc('contact-person.list.columnLastName') || 'Last Name',
                allowResize: true
            }, {
                property: 'email',
                dataIndex: 'email',
                label: this.$tc('contact-person.list.columnEmail') || 'Email',
                allowResize: true
            }, {
                property: 'phone',
                dataIndex: 'phone',
                label: this.$tc('contact-person.list.columnPhone') || 'Phone',
                allowResize: true
            }, {
                property: 'active',
                dataIndex: 'active',
                label: this.$tc('contact-person.list.columnActive') || 'Active',
                allowResize: true
            }];
        },

        // Check if any contact persons are selected for assignment
        hasSelectedContactPersons() {
            return this.selectedContactPersons && this.selectedContactPersons.length > 0;
        }
    },

    watch: {
        customer: {
            handler(newCustomer) {
                if (newCustomer && newCustomer.id) {
                    this.loadAssignedContactPersons();
                }
            },
            immediate: true
        }
    },

    created() {
        if (this.hasValidCustomer) {
            this.loadAssignedContactPersons();
        }
    },

    methods: {
        loadAssignedContactPersons() {
            if (!this.hasValidCustomer) {
                this.assignedContactPersons = null;
                return;
            }

            if (this.contactPersonsLoading) {
                return;
            }

            this.contactPersonsLoading = true;

            this.contactPersonRepository
                .search(this.assignedContactPersonCriteria, Shopware.Context.api)
                .then((result) => {
                    this.assignedContactPersons = result;
                })
                .catch((error) => {
                    console.error('Error loading assigned contact persons:', error);
                    this.assignedContactPersons = [];
                    this.createNotificationError({
                        title: this.$tc('sw-customer.contactPerson.assignmentErrorTitle'),
                        message: 'Failed to load assigned contact persons'
                    });
                })
                .finally(() => {
                    this.contactPersonsLoading = false;
                });
        },

        loadAvailableContactPersons() {
            this.contactPersonRepository
                .search(this.availableContactPersonCriteria, Shopware.Context.api)
                .then((result) => {
                    this.availableContactPersons = result;
                })
                .catch((error) => {
                    console.error('Error loading available contact persons:', error);
                    this.availableContactPersons = [];
                });
        },

        onAssignContactPersons() {
            if (!this.hasValidCustomer) {
                this.createNotificationError({
                    title: this.$tc('sw-customer.contactPerson.assignmentErrorTitle'),
                    message: 'No customer selected'
                });
                return;
            }

            this.loadAvailableContactPersons();
            this.selectedContactPersons = [];
            this.selectedContactPersonsData = {};
            this.showAssignmentModal = true;
        },

        onCloseAssignmentModal() {
            this.showAssignmentModal = false;
            this.selectedContactPersons = [];
            this.selectedContactPersonsData = {};
            this.availableContactPersons = null;
        },

        // Handle selection change from the data grid
        onSelectionChange(selection, selectionData) {
            console.log('Selection change event:', { selection, selectionData });

            // In Shopware 6.6, selection-change might pass different parameters
            // Handle both possible formats
            if (Array.isArray(selection)) {
                this.selectedContactPersons = selection;
            } else if (selection && typeof selection === 'object') {
                // If selection is an object, extract the keys (IDs)
                this.selectedContactPersons = Object.keys(selection);
            } else {
                this.selectedContactPersons = [];
            }

            console.log('Processed selected contact persons:', this.selectedContactPersons);
        },

        onConfirmAssignment() {
            if (!this.hasSelectedContactPersons) {
                this.createNotificationError({
                    title: this.$tc('sw-customer.contactPerson.assignmentErrorTitle'),
                    message: 'Please select at least one contact person to assign'
                });
                return;
            }

            console.log('Selected contact person IDs:', this.selectedContactPersons);
            console.log('Available contact persons collection:', this.availableContactPersons);

            // Get the selected contact person objects from the collection
            const selectedContactPersonObjects = [];

            this.selectedContactPersons.forEach(id => {
                // Try different ways to get the contact person
                let contactPerson = null;

                if (this.availableContactPersons.get) {
                    contactPerson = this.availableContactPersons.get(id);
                } else if (Array.isArray(this.availableContactPersons)) {
                    contactPerson = this.availableContactPersons.find(cp => cp.id === id);
                } else if (this.availableContactPersons.data) {
                    contactPerson = this.availableContactPersons.data.find(cp => cp.id === id);
                }

                if (contactPerson) {
                    selectedContactPersonObjects.push(contactPerson);
                } else {
                    console.warn('Could not find contact person with ID:', id);
                }
            });

            if (selectedContactPersonObjects.length === 0) {
                this.createNotificationError({
                    title: this.$tc('sw-customer.contactPerson.assignmentErrorTitle'),
                    message: this.$tc('sw-customer.contactPerson.assignmentErrorMessage')
                });
                return;
            }

            console.log('Assigning contact persons:', selectedContactPersonObjects);

            // Update selected contact persons with customer ID
            const updatePromises = selectedContactPersonObjects.map(contactPerson => {
                contactPerson.customerId = this.customer.id;
                return this.contactPersonRepository.save(contactPerson, Shopware.Context.api);
            });

            Promise.all(updatePromises)
                .then(() => {
                    this.onCloseAssignmentModal();
                    this.loadAssignedContactPersons();
                    this.createNotificationSuccess({
                        title: this.$tc('sw-customer.contactPerson.assignmentSuccessTitle'),
                        message: this.$tc('sw-customer.contactPerson.assignmentSuccessMessage')
                    });
                })
                .catch((error) => {
                    console.error('Error assigning contact persons:', error);
                    this.createNotificationError({
                        title: this.$tc('sw-customer.contactPerson.assignmentErrorTitle'),
                        message: this.$tc('sw-customer.contactPerson.assignmentErrorMessage')
                    });
                });
        },

        onRemoveAssignment(contactPersonId) {
            if (!contactPersonId) {
                return;
            }

            if (!confirm('Are you sure you want to remove this assignment?')) {
                return;
            }

            // Load the contact person and remove customer assignment
            this.contactPersonRepository
                .get(contactPersonId, Shopware.Context.api)
                .then((contactPerson) => {
                    contactPerson.customerId = null;
                    return this.contactPersonRepository.save(contactPerson, Shopware.Context.api);
                })
                .then(() => {
                    this.loadAssignedContactPersons();
                    this.createNotificationSuccess({
                        title: this.$tc('sw-customer.contactPerson.removeAssignmentSuccessTitle'),
                        message: this.$tc('sw-customer.contactPerson.removeAssignmentSuccessMessage')
                    });
                })
                .catch((error) => {
                    console.error('Error removing assignment:', error);
                    this.createNotificationError({
                        title: this.$tc('sw-customer.contactPerson.removeAssignmentErrorTitle'),
                        message: this.$tc('sw-customer.contactPerson.removeAssignmentErrorMessage')
                    });
                });
        },

        // Navigate to contact person detail in separate module
        onEditContactPerson(contactPerson) {
            this.$router.push({
                name: 'contact.person.detail',
                params: { id: contactPerson.id }
            });
        },

        metaInfo() {
            return {
                title: this.$tc('sw-customer.contactPerson.tabTitle')
            };
        }
    }
});