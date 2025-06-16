<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Subscriber;

use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Storefront\Page\Account\Profile\AccountProfilePageLoadedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ContactPersonSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly EntityRepository $contactPersonRepository
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            AccountProfilePageLoadedEvent::class => 'onAccountProfilePageLoaded',
        ];
    }

    public function onAccountProfilePageLoaded(AccountProfilePageLoadedEvent $event): void
    {
        $customer = $event->getSalesChannelContext()->getCustomer();
        if (!$customer instanceof CustomerEntity) {
            return;
        }

        $contactPersons = $this->loadContactPersons($customer->getId(), $event->getContext());

        $event->getPage()->addExtension('contactPersons', new ArrayStruct($contactPersons));
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