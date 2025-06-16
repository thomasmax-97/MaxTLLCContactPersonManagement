// src/Resources/app/administration/src/page/sw-customer-detail/index.js

import template from './sw-customer-detail.html.twig';

// Override the template, using the actual template from the core
Shopware.Component.override('sw-customer-detail', {
    template
});