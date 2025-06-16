<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Storefront\Controller;

use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Page\GenericPageLoader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route(defaults: ['_routeScope' => ['storefront']])]
class ContactPersonPageController extends StorefrontController
{
    public function __construct(
        private readonly EntityRepository $contactPersonRepository,
        private readonly GenericPageLoader $genericPageLoader
    ) {
    }

    #[Route(
        path: '/account/contact-persons',
        name: 'frontend.account.contact.persons',
        options: ['seo' => false],
        defaults: ['_loginRequired' => true],
        methods: ['GET']
    )]
    public function contactPersons(Request $request, SalesChannelContext $context): Response
    {
        $page = $this->genericPageLoader->load($request, $context);

        $customer = $context->getCustomer();
        if (!$customer instanceof CustomerEntity) {
            throw new \RuntimeException('Customer not found');
        }

        $contactPersons = $this->loadContactPersons($customer->getId(), $context->getContext());

        return $this->renderStorefront('@MaxTLLCContactPersonManagement/storefront/page/account/contact-persons.html.twig', [
            'page' => $page,
            'contactPersons' => $contactPersons,
        ]);
    }

    private function loadContactPersons(string $customerId, Context $context): array
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('customerId', $customerId));
        $criteria->addFilter(new EqualsFilter('active', true));
        $criteria->addAssociation('image');
        $criteria->addSorting(new FieldSorting('firstName'));

        $result = $this->contactPersonRepository->search($criteria, $context);

        return $result->getEntities()->getElements();
    }
}