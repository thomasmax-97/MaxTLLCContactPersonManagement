<?php declare(strict_types=1);

namespace MaxTLLC\MaxTLLCContactPersonManagement\Core\Checkout\Customer\Aggregate\ContactPerson;

use Shopware\Core\Checkout\Customer\CustomerDefinition;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\CreatedAtField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\UpdatedAtField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ContactPersonDefinition extends EntityDefinition
{
    public const string ENTITY_NAME = 'maxtllc_contact_person';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return ContactPersonEntity::class;
    }

    public function getCollectionClass(): string
    {
        return ContactPersonCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required()),

            (new StringField('first_name', 'firstName'))->addFlags(new Required()),
            (new StringField('last_name', 'lastName'))->addFlags(new Required()),
            (new StringField('email', 'email'))->addFlags(new Required()),
            new StringField('phone', 'phone'),

            new FkField('customer_id', 'customerId', CustomerDefinition::class),
            (new BoolField('active', 'active'))->addFlags(new Required()),
            new FkField('image_id', 'imageId', MediaDefinition::class),

            new CreatedAtField(),
            new UpdatedAtField(),

            // Associations
            new ManyToOneAssociationField('customer', 'customer_id', CustomerDefinition::class, 'id', false),
            new ManyToOneAssociationField('image', 'image_id', MediaDefinition::class, 'id', false),
        ]);
    }
}