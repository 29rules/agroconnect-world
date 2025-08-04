import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.orders': 'Orders',
      'nav.contact': 'Contact',
      'nav.analytics': 'Analytics',
      
      // Hero Section
      'hero.title': 'Connecting Farmers with Modern Agricultural Solutions',
      'hero.subtitle': 'Empowering farmers with cutting-edge technology, smart analytics, and a global community to revolutionize agriculture for a sustainable future.',
      'hero.getStarted': 'Get Started',
      'hero.learnMore': 'Learn More',
      
      // Features
      'features.title': 'Why Choose AgroConnect World?',
      'features.subtitle': 'Discover the advantages that make us the leading agricultural technology platform',
      'features.fast': 'Lightning Fast',
      'features.fastDesc': 'Real-time data processing and instant insights',
      'features.secure': 'Secure & Reliable',
      'features.secureDesc': 'Enterprise-grade security protecting your valuable data',
      'features.community': 'Community Driven',
      'features.communityDesc': 'Connect with farmers and experts worldwide',
      'features.data': 'Data Driven',
      'features.dataDesc': 'AI-powered recommendations for optimal results',
      
      // Products
      'products.title': 'Our Solutions',
      'products.subtitle': 'Comprehensive tools and services designed for modern agriculture',
      'products.mobileApp': 'Mobile App',
      'products.mobileDesc': 'Access your farm data anywhere with our intuitive mobile application',
      'products.analytics': 'Smart Analytics',
      'products.analyticsDesc': 'AI-powered insights to optimize your farming operations',
      'products.marketplace': 'Global Marketplace',
      'products.marketplaceDesc': 'Connect with suppliers and buyers worldwide',
      
      // Product Features
      'productFeatures.realtime': 'Real-time monitoring',
      'productFeatures.offline': 'Offline capability',
      'productFeatures.notifications': 'Push notifications',
      'productFeatures.predictive': 'Predictive analytics',
      'productFeatures.weather': 'Weather integration',
      'productFeatures.recommendations': 'Crop recommendations',
      'productFeatures.trading': 'Direct trading',
      'productFeatures.quality': 'Quality assurance',
      'productFeatures.payments': 'Secure payments',
      
      // Testimonials
      'testimonials.title': 'What Farmers Say',
      'testimonials.subtitle': 'Real stories from our global community',
      
      // CTA
      'cta.title': 'Ready to Transform Your Farming?',
      'cta.subtitle': 'Join thousands of farmers who are already using AgroConnect World to improve their operations',
      'cta.button': 'Start Your Free Trial',
      
      // Footer
      'footer.description': 'Empowering farmers with modern technology and global connections for a sustainable agricultural future.',
      'footer.quickLinks': 'Quick Links',
      'footer.services': 'Services',
      'footer.contactInfo': 'Contact Info',
      'footer.copyright': '© 2024 AgroConnect World. All rights reserved.',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.add': 'Add',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',
      'common.export': 'Export',
      'common.import': 'Import',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.products': 'Produits',
      'nav.orders': 'Commandes',
      'nav.contact': 'Contact',
      'nav.analytics': 'Analyses',
      
      // Hero Section
      'hero.title': 'Connecter les Agriculteurs avec des Solutions Agricoles Modernes',
      'hero.subtitle': 'Donner aux agriculteurs les moyens d\'utiliser la technologie de pointe, l\'analyse intelligente et une communauté mondiale pour révolutionner l\'agriculture pour un avenir durable.',
      'hero.getStarted': 'Commencer',
      'hero.learnMore': 'En Savoir Plus',
      
      // Features
      'features.title': 'Pourquoi Choisir AgroConnect World?',
      'features.subtitle': 'Découvrez les avantages qui font de nous la plateforme technologique agricole leader',
      'features.fast': 'Ultra Rapide',
      'features.fastDesc': 'Traitement des données en temps réel et insights instantanés',
      'features.secure': 'Sécurisé et Fiable',
      'features.secureDesc': 'Sécurité de niveau entreprise protégeant vos données précieuses',
      'features.community': 'Dirigé par la Communauté',
      'features.communityDesc': 'Connectez-vous avec des agriculteurs et experts du monde entier',
      'features.data': 'Basé sur les Données',
      'features.dataDesc': 'Recommandations alimentées par l\'IA pour des résultats optimaux',
      
      // Products
      'products.title': 'Nos Solutions',
      'products.subtitle': 'Outils et services complets conçus pour l\'agriculture moderne',
      'products.mobileApp': 'Application Mobile',
      'products.mobileDesc': 'Accédez à vos données agricoles partout avec notre application mobile intuitive',
      'products.analytics': 'Analyses Intelligentes',
      'products.analyticsDesc': 'Insights alimentés par l\'IA pour optimiser vos opérations agricoles',
      'products.marketplace': 'Marché Mondial',
      'products.marketplaceDesc': 'Connectez-vous avec des fournisseurs et acheteurs du monde entier',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.save': 'Sauvegarder',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.add': 'Ajouter',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',
      'common.export': 'Exporter',
      'common.import': 'Importer',
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.products': 'Productos',
      'nav.orders': 'Pedidos',
      'nav.contact': 'Contacto',
      'nav.analytics': 'Análisis',
      
      // Hero Section
      'hero.title': 'Conectando Agricultores con Soluciones Agrícolas Modernas',
      'hero.subtitle': 'Empoderando a los agricultores con tecnología de vanguardia, análisis inteligente y una comunidad global para revolucionar la agricultura para un futuro sostenible.',
      'hero.getStarted': 'Comenzar',
      'hero.learnMore': 'Saber Más',
      
      // Features
      'features.title': '¿Por Qué Elegir AgroConnect World?',
      'features.subtitle': 'Descubre las ventajas que nos convierten en la plataforma tecnológica agrícola líder',
      'features.fast': 'Ultra Rápido',
      'features.fastDesc': 'Procesamiento de datos en tiempo real e insights instantáneos',
      'features.secure': 'Seguro y Confiable',
      'features.secureDesc': 'Seguridad de nivel empresarial protegiendo tus datos valiosos',
      'features.community': 'Impulsado por la Comunidad',
      'features.communityDesc': 'Conéctate con agricultores y expertos de todo el mundo',
      'features.data': 'Basado en Datos',
      'features.dataDesc': 'Recomendaciones impulsadas por IA para resultados óptimos',
      
      // Products
      'products.title': 'Nuestras Soluciones',
      'products.subtitle': 'Herramientas y servicios integrales diseñados para la agricultura moderna',
      'products.mobileApp': 'Aplicación Móvil',
      'products.mobileDesc': 'Accede a tus datos agrícolas en cualquier lugar con nuestra aplicación móvil intuitiva',
      'products.analytics': 'Análisis Inteligente',
      'products.analyticsDesc': 'Insights impulsados por IA para optimizar tus operaciones agrícolas',
      'products.marketplace': 'Mercado Global',
      'products.marketplaceDesc': 'Conéctate con proveedores y compradores de todo el mundo',
      
      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.cancel': 'Cancelar',
      'common.save': 'Guardar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.view': 'Ver',
      'common.add': 'Agregar',
      'common.search': 'Buscar',
      'common.filter': 'Filtrar',
      'common.sort': 'Ordenar',
      'common.export': 'Exportar',
      'common.import': 'Importar',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 