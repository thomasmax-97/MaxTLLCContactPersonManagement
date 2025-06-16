<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Core\Content\Media;

use MaxTLLC\MaxTLLCContactPersonManagement\Core\Checkout\Customer\Aggregate\ContactPerson\ContactPersonDefinition;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class MediaExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            new OneToManyAssociationField(
                'contactPersons',
                ContactPersonDefinition::class,
                'image_id'
            )
        );
    }

    public function getDefinitionClass(): string
    {
        return MediaDefinition::class;
    }
}