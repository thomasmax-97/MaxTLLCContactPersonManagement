import './module/contact-person';
import './extension/sw-customer';

// Register the route for the contact persons tab
Shopware.Module.register('sw-customer-contact-persons-tab', {
    routeMiddleware(next, currentRoute) {
        const customRouteName = 'sw.customer.detail.contactPersons';

        if (
            currentRoute.name === 'sw.customer.detail'
            && currentRoute.children.every((currentRoute) => currentRoute.name !== customRouteName)
        ) {
            currentRoute.children.push({
                name:      customRouteName,
                path:      '/sw/customer/detail/:id/contactPersons',
                component: 'sw-customer-detail-contact-persons',
                meta:      {
                    parentPath: 'sw.customer.index'
                }
            });
        }
        next(currentRoute);
    }
});