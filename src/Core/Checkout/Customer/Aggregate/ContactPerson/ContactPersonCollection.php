<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Core\Checkout\Customer\Aggregate\ContactPerson;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @extends EntityCollection<ContactPersonEntity>
 */
class ContactPersonCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return ContactPersonEntity::class;
    }
}