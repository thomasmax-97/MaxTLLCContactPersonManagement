// src/Resources/app/administration/src/module/contact-person/index.js
import './page/contact-person-list';
import './page/contact-person-detail';
import './page/contact-person-create';

const { Module } = Shopware;

Module.register('contact-person', {
    type: 'plugin',
    name: 'contact-person',
    title: 'contact-person.general.mainMenuItemGeneral',
    description: 'contact-person.general.descriptionTextModule',
    color: '#ff3d58',
    icon: 'default-identity-card',

    routes: {
        list: {
            component: 'contact-person-list',
            path: 'list',
            meta: {
                privilege: 'contact_person:read'
            }
        },
        detail: {
            component: 'contact-person-detail',
            path: 'detail/:id?',
            meta: {
                parentPath: 'contact.person.list',
                privilege: 'contact_person:read'
            }
        },
        create: {
            component: 'contact-person-create',
            path: 'create',
            meta: {
                parentPath: 'contact.person.list',
                privilege: 'contact_person:create'
            }
        }
    },

    navigation: [{
        label: 'contact-person.general.mainMenuItemGeneral',
        color: '#ff3d58',
        path: 'contact.person.list',
        icon: 'default-identity-card',
        parent: 'sw-customer',
        position: 100,
        privilege: 'contact_person:read'
    }]
});