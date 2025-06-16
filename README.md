# MaxTLLCContactPersonManagement - Shopware 6 Plugin

A Shopware 6 test plugin that enables assignment and management of contact persons for customers in both admin and frontend environments.

## Overview

This plugin extends Shopware 6's customer management capabilities by allowing multiple contact persons to be assigned to customers. Contact persons can be managed through a dedicated admin interface and are displayed in the customer frontend.

## Features

### Core Functionality
- **Contact Person Entity**: Custom entity with comprehensive contact information
- **Admin Management**: Dedicated admin interface for contact person CRUD operations
- **Customer Integration**: Seamless integration with existing customer entities
- **Frontend Display**: Customer-facing contact person information

### Contact Person Fields
- `firstName` (string) - Contact's first name
- `lastName` (string) - Contact's last name  
- `email` (string) - Contact email address
- `phone` (string, optional) - Contact phone number
- `customerId` (relation) - Link to CustomerEntity
- `active` (boolean) - Contact person status
- `imageId` (relation, optional) - Link to MediaEntity for contact photo

## Installation

### Requirements
- Shopware 6.4.0 or higher
- PHP 7.4 or higher

### Manual Installation
1. Download the plugin files
2. Place in `custom/plugins/MaxTLLCContactPersonManagement/`
3. Run installation commands:
```bash
bin/console plugin:refresh
bin/console plugin:install --activate MaxTLLCContactPersonManagement
bin/console cache:clear
```

## Usage

### Admin Interface

#### Contact Person Management
Navigate to **Customers > Contact Persons** in the admin panel to:
- View all contact persons with associated customer names
- Create new contact persons
- Edit existing contact information
- Delete contact persons
- Toggle active/inactive status

#### Customer Assignment
In the customer detail view:
- Assign existing contact persons to customers
- Create new contact persons directly from customer details
- Manage customer-contact relationships

### Frontend Display

Contact persons are automatically displayed in the customer account area, showing:
- Active contact persons for the logged-in customer
- Contact details (name, email, phone)
- Contact images (if uploaded)

## Technical Implementation

### Database Schema
The plugin creates a new `maxtllc_contact_person` table with proper foreign key relationships to the customer and media tables.

### File Structure
```
MaxTLLCContactPersonManagement/
├── src/
│   ├── Core/
│   │   └── Checkout/
│   │       └── Customer/
│   │           └── Aggregate/
│   │               └── ContactPerson/
│   ├── Administration/
│   │   └── Resources/
│   ├── Storefront/
│   │   └── Resources/
│   └── Migration/
├── composer.json
└── README.md
```

### Key Components
- **ContactPersonEntity**: Core entity definition with `maxtllc_contact_person` table
- **ContactPersonDefinition**: Entity schema and relationships to Customer and Media
- **Admin Components**: Vue.js components for admin interface
- **Storefront Integration**: Twig templates and extensions

## Development

### Time Investment Breakdown
- **Block 1** (~60 min): Entity creation and basic structure
- **Block 2** (~120 min): Admin interface development  
- **Block 3** (~90 min): Frontend integration

### Test Task Notes
This plugin is developed as a test task focusing on technical implementation. The core entity is defined with proper Shopware 6 DAL structure including:
- Entity definition with all required fields
- Proper associations to Customer and Media entities
- Database field mapping (snake_case to camelCase)

### Extending the Plugin
The plugin architecture allows for easy extension:
- Add custom fields to ContactPersonEntity
- Implement additional validation rules
- Create custom admin modules
- Add frontend styling and interactions

## Technical Details

### Entity Structure
The `ContactPersonDefinition` creates the following database structure:
- **Table**: `maxtllc_contact_person`
- **Primary Key**: `id` (UUID)
- **Required Fields**: `first_name`, `last_name`, `email`, `active`
- **Optional Fields**: `phone`, `customer_id`, `image_id`
- **Timestamps**: `created_at`, `updated_at`
- **Associations**: Customer (many-to-one), Media/Image (many-to-one)

## Configuration

No additional configuration required. The plugin works out of the box after installation.

## Troubleshooting

### Common Issues
- **Plugin not visible**: Run `bin/console plugin:refresh`
- **Database errors**: Check migration status with `bin/console database:migrate --all`
- **Admin interface issues**: Clear cache with `bin/console cache:clear`

### Debug Mode
Enable Shopware debug mode for detailed error information during development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This plugin is released under the MIT License.

## Support

For technical support and questions:
- Check the documentation
- Review common troubleshooting steps
- Contact the development team

---

**Note**: This plugin focuses on technical functionality. Styling and UI/UX enhancements are considered nice-to-have features and can be implemented based on specific design requirements.
