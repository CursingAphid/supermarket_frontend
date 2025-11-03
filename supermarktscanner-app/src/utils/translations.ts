export const translations: Record<string, Record<string, string>> = {
  nl: {
    // Navigation
    'nav.search': 'Zoeken',
    'nav.location': 'Locatie',
    'nav.settings': 'Instellingen',

    // Location Setup
    'location.setTitle': 'Stel uw locatie in',
    'location.setSubtitle': 'Voer uw adres in en selecteer hoe ver u wilt reizen',
    'location.address': 'Adres',
    'location.addressPlaceholder': 'bijv. Damrak 1, Amsterdam, Nederland',
    'location.distance': 'Reisafstand (km)',
    'location.distanceMax': 'Reisafstand (km) - Max: {{max}} km',
    'location.distancePlaceholder': '0 - {{max}}',
    'location.setButton': 'Locatie instellen',
    'location.updateButton': 'Locatie bijwerken',
    'location.currentLocation': 'Huidige locatie',
    'location.maxDistance': 'Max afstand: {{km}} km',
    'location.notSet': 'Niet ingesteld',
    'location.notSetMessage': 'Stel eerst uw locatie in.',
    'location.notSetSearch': 'Stel uw locatie in om te beginnen met zoeken naar producten.',
    'location.notSetMap': 'Stel uw locatie in om nabijgelegen supermarkten te bekijken.',
    'location.success': 'Locatie ingesteld',
    'location.updateSuccess': 'Locatie en straal succesvol bijgewerkt!',
    'location.error': 'Fout bij instellen locatie',
    'location.updateError': 'Fout bij bijwerken locatie',
    'location.addressRequired': 'Adres vereist',
    'location.addressRequiredMessage': 'Voer een geldig adres in.',
    'location.radiusInvalid': 'Ongeldige straal',
    'location.radiusInvalidMessage': 'Maximum straal is {{max}} km. Voer een waarde in tussen 0 en {{max}}.',
    'location.radiusTooSmall': 'Straal moet groter zijn dan 0 km.',

    // Settings
    'settings.title': 'Locatie-instellingen',
    'settings.subtitle': 'Werk uw adres en reisafstand bij',

    // Product Search
    'search.placeholder': 'Voer productzoekwoord in',
    'search.button': 'Zoeken',
    'search.searching': 'Zoeken naar producten...',
    'search.noResults': "Geen producten gevonden voor '{{keyword}}' in uw omgeving.",
    'search.found': "Gevonden {{count}} producten voor '{{keyword}}' in uw omgeving",
    'search.keywordRequired': 'Zoekwoord vereist',
    'search.keywordRequiredMessage': 'Voer een productzoekwoord in om te zoeken.',
    'search.locationRequired': 'Locatie vereist',
    'search.locationRequiredMessage': 'Stel uw locatie in voordat u zoekt.',
    'search.error': 'Fout bij zoeken naar producten',

    // Supermarkets
    'supermarkets.title': 'Supermarkten',
    'supermarkets.found': '{{count}} gevonden binnen {{radius}} km',
    'supermarkets.brand': 'Merk: {{brand}}',
    'supermarkets.distance': 'Afstand: {{distance}} km',
    'supermarkets.none': 'Geen supermarkten gevonden binnen {{radius}} km straal.',
    'supermarkets.distanceNA': 'N/A km',

    // Product Card
    'product.supermarket': '{{name}}',
    'product.price': 'Prijs: {{price}}',
    'product.size': 'Grootte: {{size}}',

    // General
    'general.error': 'Er is een fout opgetreden. Probeer het opnieuw.',
    'general.loading': 'Laden...',
    'general.success': 'Succes',
    'general.errorTitle': 'Fout',
    'general.update': 'Bijwerken',
    'general.set': 'Instellen',
    'general.change': 'Wijzigen',
    'general.save': 'Opslaan',
    'general.cancel': 'Annuleren',

    // Theme
    'theme.title': 'Thema',
    'theme.dark': 'Donker',
    'theme.light': 'Licht',

    // Language
    'language.title': 'Taal',
    'language.dutch': 'Nederlands',
    'language.english': 'Engels',
  },
  en: {
    // Navigation
    'nav.search': 'Search',
    'nav.location': 'Location',
    'nav.settings': 'Settings',

    // Location Setup
    'location.setTitle': 'Set Your Location',
    'location.setSubtitle': 'Enter your address and select how far you want to travel',
    'location.address': 'Address',
    'location.addressPlaceholder': 'e.g., Damrak 1, Amsterdam, Netherlands',
    'location.distance': 'Travel distance (km)',
    'location.distanceMax': 'Travel distance (km) - Max: {{max}} km',
    'location.distancePlaceholder': '0 - {{max}}',
    'location.setButton': 'Set Location',
    'location.updateButton': 'Update Location',
    'location.currentLocation': 'Current Location',
    'location.maxDistance': 'Max distance: {{km}} km',
    'location.notSet': 'Not set',
    'location.notSetMessage': 'Please set your location first.',
    'location.notSetSearch': 'Please set your location to start searching for products.',
    'location.notSetMap': 'Please set your location to view nearby supermarkets.',
    'location.success': 'Location set',
    'location.updateSuccess': 'Location and radius updated successfully!',
    'location.error': 'Failed to set location',
    'location.updateError': 'Failed to update location',
    'location.addressRequired': 'Address required',
    'location.addressRequiredMessage': 'Please enter a valid address.',
    'location.radiusInvalid': 'Invalid radius',
    'location.radiusInvalidMessage': 'Maximum radius is {{max}} km. Please enter a value between 0 and {{max}}.',
    'location.radiusTooSmall': 'Radius must be greater than 0 km.',

    // Settings
    'settings.title': 'Location Settings',
    'settings.subtitle': 'Update your address and travel distance',

    // Product Search
    'search.placeholder': 'Enter product keyword',
    'search.button': 'Search',
    'search.searching': 'Searching for products...',
    'search.noResults': "No products found for '{{keyword}}' in your area.",
    'search.found': "Found {{count}} products for '{{keyword}}' in your area",
    'search.keywordRequired': 'Keyword required',
    'search.keywordRequiredMessage': 'Please enter a product keyword to search.',
    'search.locationRequired': 'Location required',
    'search.locationRequiredMessage': 'Please set your location before searching.',
    'search.error': 'Product search failed',

    // Supermarkets
    'supermarkets.title': 'Supermarkets',
    'supermarkets.found': '{{count}} found within {{radius}} km',
    'supermarkets.brand': 'Brand: {{brand}}',
    'supermarkets.distance': 'Distance: {{distance}} km',
    'supermarkets.none': 'No supermarkets found within {{radius}} km radius.',
    'supermarkets.distanceNA': 'N/A km',

    // Product Card
    'product.supermarket': '{{name}}',
    'product.price': 'Price: {{price}}',
    'product.size': 'Size: {{size}}',

    // General
    'general.error': 'An error occurred. Please try again.',
    'general.loading': 'Loading...',
    'general.success': 'Success',
    'general.errorTitle': 'Error',
    'general.update': 'Update',
    'general.set': 'Set',
    'general.change': 'Change',
    'general.save': 'Save',
    'general.cancel': 'Cancel',

    // Theme
    'theme.title': 'Theme',
    'theme.dark': 'Dark',
    'theme.light': 'Light',

    // Language
    'language.title': 'Language',
    'language.dutch': 'Dutch',
    'language.english': 'English',
  },
};

