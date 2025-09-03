import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Star,
  Shield,
  Clock,
  Users,
  Award,
  ArrowUp,
  Building,
  Home,
  Wrench,
  Zap,
  Eye,
  Target,
  CheckCircle,
  MessageCircle,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      
      // Active section detection
      const sections = ['home', 'about', 'products', 'store', 'blog', 'faq', 'partners', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const products = [
    {
      title: "Panjur Sistemleri",
      description: "Dıştan takma, PVC ve alüminyum monoblok, gizli, lento ve çelik/poliüretanlı panjur çeşitleri",
      icon: <Shield className="w-8 h-8" />,
      image: "/images/products/panjur-1.png",
      features: ["Dıştan Takma", "MonoBlok", "Gizli Kutulu", "Lento Sistemi"]
    },
    {
      title: "Kepenk Sistemleri", 
      description: "Şeffaf, kayar katlanır, çelik-poliüretanlı ve alüminyum ekstrüzyon kepenk sistemleri",
      icon: <Building className="w-8 h-8" />,
      image: "/images/products/kepenk-1.jpg",
      features: ["Şeffaf Kepenk", "Kayar Katlanır", "Çelik Kepenk", "Alüminyum"]
    },
    {
      title: "Pergola & Tente",
      description: "Rolling roof, bioklimatik pergola ve tente sistemleri ile dış mekan çözümleri",
      icon: <Home className="w-8 h-8" />,
      image: "/images/products/pergola-1.jpg",
      features: ["Rolling Roof", "BioClimatic", "Tente", "Dış Mekan"]
    },
    {
      title: "Otomatik Kapı",
      description: "Fotoselli, 90° açılım, döner, hermetik, akustik ve yüksek güvenlikli kapı sistemleri",
      icon: <Zap className="w-8 h-8" />,
      image: "/images/products/otomatik-kapi-1.jpg",
      features: ["Fotoselli", "Döner Kapı", "Hermetik", "Akustik"]
    },
    {
      title: "Giyotin & Cam Sistemleri",
      description: "Sürme cam sistemleri ve rüzgar kırıcı çözümleri ile modern yaşam alanları",
      icon: <Square className="w-8 h-8" />,
      image: "/images/products/giyotin-1.jpg",
      features: ["Giyotin Cam", "Sürme Sistem", "Rüzgar Kırıcı", "Modern Tasarım"]
    },
    {
      title: "Akıllı Sistemler",
      description: "Yapay zeka destekli otomasyon, akıllı cam uygulamaları ve IoT entegrasyonu",
      icon: <Brain className="w-8 h-8" />,
      image: "/images/products/akilli-1.jpg",
      features: ["AI Destekli", "IoT Entegrasyon", "Akıllı Cam", "Otomasyon"]
    }
  ]

  const shopProducts = [
    {
      title: "Kepenk Motoru 60 Nm",
      description: "Redüktörlü tüp kepenk motoru, yüksek performans ve dayanıklılık",
      image: "/images/shop/kepenk-motor-1.webp",
      price: "₺1,250",
      originalPrice: "₺1,450",
      discount: "-14%"
    },
    {
      title: "Panjur Motoru 50 Nm", 
      description: "Düz panjur motoru, sessiz çalışma ve uzun ömür",
      image: "/images/shop/panjur-motor-1.jpg",
      price: "₺2,500",
      originalPrice: "₺2,850",
      discount: "-12%"
    },
    {
      title: "Otomatik Kapı Kumandası",
      description: "BFT marka garaj kumandası, 433 MHz frekans",
      image: "/images/shop/kumanda-1.jpg",
      price: "₺185",
      originalPrice: "₺220",
      discount: "-16%"
    },
    {
      title: "Endüstriyel Kepenk Motoru",
      description: "380V AC endüstriyel kepenk motoru, ağır hizmet tipi",
      image: "/images/shop/kepenk-motor-3.png",
      price: "₺5,200",
      originalPrice: "₺5,850",
      discount: "-11%"
    }
  ]

  const stats = [
    { number: "2008", label: "Kuruluş Yılı", icon: <Award className="w-6 h-6" /> },
    { number: "500+", label: "Tamamlanan Proje", icon: <Building className="w-6 h-6" /> },
    { number: "%98", label: "Müşteri Memnuniyeti", icon: <Star className="w-6 h-6" /> },
    { number: "15+", label: "Yıl Tecrübe", icon: <Clock className="w-6 h-6" /> }
  ]

  const navigationItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'products', label: 'Ürünler' },
    { id: 'store', label: 'Mağaza' },
    { id: 'blog', label: 'Blog' },
    { id: 'faq', label: 'S.S.S' },
    { id: 'partners', label: 'İş Ortakları' },
    { id: 'contact', label: 'İletişim' }
  ]

  return (
    <div className="min-h-screen bg-white smooth-scroll">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-toz-dark-gray rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold toz-dark-gray">TOZ YAPI</h1>
                <p className="text-xs text-gray-600">TEKNOLOJİLERİ</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-green-600 ${
                    activeSection === item.id ? 'text-green-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Contact Info & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <a href="tel:+905367731404" className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                  <Phone className="w-4 h-4" />
                  <span>+90 536 773 14 04</span>
                </a>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-gray-700 hover:text-green-600 py-2"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section min-h-screen flex items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="toz-yellow">KEŞFEDİN!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-200">
              Belki de ihtiyacınız olan ürün burada
            </p>
            <p className="text-lg mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kapsamlı ürün yelpazemizle tüm binalarda ve yapı projelerinde projelendirme, 
              satış ve satış sonrası ile; santrallerden inşaata, dekorasyona, 
              Yapı Teknolojileri Ürünleri ile her ayrıntıda sizinleyiz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-toz-green hover:bg-green-600 text-white px-8 py-3"
                onClick={() => scrollToSection('products')}
              >
                Ürünlerimizi Keşfedin
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
                onClick={() => scrollToSection('contact')}
              >
                İletişime Geçin
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-toz-green rounded-full flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold toz-dark-gray mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title">
                <span className="toz-yellow">Lüks ve Elit Duruş!</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Sıradan çözümler yerine size özel, yapay zekâyla harmanlanmış sofistike tasarımlar ve alternatifler sunar. 
                Her çizgide zarafet, her detayda mühendislik… Prestijli yapılar için ayrıcalıklı seçim.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 toz-dark-gray">Bizim Hikayemiz</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  2008 yılında adım attığımız sektörde, günümüzde hemen hemen herkesin kullandığı veya 
                  projesinde tercih ettiği birçok yenilikçi ve teknolojik ürünü tanıtılmasını, 
                  yaygınlaştırılmasını başardık. O zamandan beri birçok projeyi başarıyla tamamladık.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  "MUTLU MÜŞTERİ" mottosuyla ilerlediğimiz bu yolda, 2024 yılında kararlarımızı 
                  daha özgür ifade edebilmek için daha güçlü ve tecrübeli yenilikçi çözümler sunmayı hedefliyoruz.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 toz-green" />
                      Amacımız
                    </h4>
                    <p className="text-gray-600 pl-7">
                      İnşaat sektöründe sürdürülebilir, yenilikçi ve kaliteli çözümler sunarak, 
                      sektördeki liderliğimizi pekiştirmek ve yaşam alanlarına değer katmak.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <Eye className="w-5 h-5 mr-2 toz-green" />
                      Hedeflerimiz
                    </h4>
                    <p className="text-gray-600 pl-7">
                      Her projede mükemmeliyet ve müşteri memnuniyeti hedefleyerek, deneyimli ekibimizle 
                      yenilikçi tasarımlar geliştirmek; güvenilir üyelerle iş birliği yaparak inşaat 
                      alanında fark yaratan projelere imza atmak.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="product-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-3 toz-green" />
                      Deneyimli Ekip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      15+ yıllık sektör deneyimi ile uzman kadromuz, her projede mükemmellik için çalışır.
                    </p>
                  </CardContent>
                </Card>

                <Card className="product-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-6 h-6 mr-3 toz-green" />
                      Kaliteli Malzeme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Sadece en kaliteli malzemeler kullanarak, uzun ömürlü ve dayanıklı çözümler sunuyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card className="product-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-6 h-6 mr-3 toz-green" />
                      Zamanında Teslimat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Belirlenen sürelerde eksiksiz teslimat ile müşteri memnuniyetini önceleyiyoruz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              Ürün Gruplarımız
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              <span className="toz-green font-semibold">Mükemmel Tasarımlar, Üstün Mimari Detaylar</span>
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4">
              Klasik alüminyum doğrama çözümlerinden farklı olarak, Toz Yapı Teknolojileri ve 
              İş ortakları yapay zekâ destekli sistemleriyle size modern, akıllı ve estetik çözümler sunar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="product-card h-full overflow-hidden">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant="secondary" className="absolute top-4 right-4 bg-toz-yellow text-gray-800">
                    Yeni
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-toz-green rounded-lg flex items-center justify-center text-white mr-4">
                      {product.icon}
                    </div>
                    <CardTitle className="text-xl toz-dark-gray">{product.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 toz-green" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-toz-dark-gray hover:bg-gray-800 text-white">
                    Detayları Görüntüle
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section id="store" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              Online Mağaza
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kaliteli ürünlerimizi online olarak keşfedin ve avantajlı fiyatlarla satın alın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.map((product, index) => (
              <Card key={index} className="product-card overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.discount && (
                    <Badge variant="destructive" className="absolute top-2 left-2 bg-red-500">
                      {product.discount}
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight">{product.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold toz-green">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-toz-dark-gray hover:bg-gray-800">
                    Sepete Ekle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-toz-green hover:bg-green-600 text-white">
              Tüm Ürünleri Görüntüle
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              Blog & Haberler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sektördeki son gelişmeler, teknik bilgiler ve proje örnekleri.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="product-card">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <MessageCircle className="w-16 h-16 text-gray-400" />
                  </div>
                  <Badge variant="secondary" className="w-fit mb-2">
                    Teknik Bilgi
                  </Badge>
                  <CardTitle className="text-xl">Blog Yazısı {item}</CardTitle>
                  <CardDescription>
                    Yapı teknolojileri alanında önemli gelişmeler ve teknik detaylar hakkında bilgilendirici içerik.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>23 Temmuz 2025</span>
                    <span>5 dk okuma</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Devamını Oku
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Müşterilerimizin en çok merak ettiği konular ve cevapları.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Panjur sistemleri için garanti süresi nedir?",
                answer: "Tüm panjur sistemlerimiz için 5 yıl garanti sunuyoruz. Garanti kapsamında ücretsiz bakım ve onarım hizmeti verilmektedir."
              },
              {
                question: "Otomatik kapı sistemleri hangi teknolojileri kullanır?",
                answer: "Fotoselli sensörler, akıllı kontrol sistemleri ve IoT entegrasyonu ile en son teknoloji ürünlerini kullanıyoruz."
              },
              {
                question: "Proje danışmanlığı hizmeti veriyor musunuz?",
                answer: "Evet, deneyimli mimar ve mühendis kadromuzla ücretsiz proje danışmanlığı hizmeti sunuyoruz."
              }
            ].map((faq, index) => (
              <Card key={index} className="product-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="w-5 h-5 mr-3 toz-green" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              İş Ortaklarımız
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Güvenilir tedarikçilerimiz ve iş ortaklarımızla kaliteli hizmet sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((partner) => (
              <div key={partner} className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building className="w-10 h-10 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 section-title toz-dark-gray">
              İletişim
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Projeleriniz için bizimle iletişime geçin. Uzman ekibimiz size yardımcı olmaya hazır.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 toz-dark-gray">İletişim Bilgileri</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-toz-green rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Adres</h4>
                      <p className="text-gray-600">
                        Üniversiteler Mah. 1597. Cad Bilkent Center AVM No:3<br />
                        Bilkent Çankaya ANKARA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-toz-green rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Telefon</h4>
                      <p className="text-gray-600">+90 536 773 14 04</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-toz-green rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">E-posta</h4>
                      <div className="space-y-1 text-gray-600">
                        <p>merhaba@tozyapi.com.tr</p>
                        <p>destek@tozyapi.com.tr</p>
                        <p>Luna@tozyapi.com.tr</p>
                        <p>Ozkan@tozyapi.com.tr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-semibold mb-4">Sosyal Medya</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, href: "#" },
                    { icon: <Instagram className="w-5 h-5" />, href: "#" },
                    { icon: <Twitter className="w-5 h-5" />, href: "#" },
                    { icon: <Linkedin className="w-5 h-5" />, href: "#" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-toz-green hover:text-white transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="product-card">
              <CardHeader>
                <CardTitle className="text-xl">Bize Ulaşın</CardTitle>
                <CardDescription>
                  Proje detaylarınızı paylaşın, size en uygun çözümü sunalım.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                    <Input placeholder="Adınızı girin" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon</label>
                    <Input placeholder="Telefon numaranızı girin" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-posta</label>
                  <Input type="email" placeholder="E-posta adresinizi girin" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Konu</label>
                  <Input placeholder="Konu başlığını girin" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mesaj</label>
                  <Textarea 
                    placeholder="Proje detaylarınızı ve ihtiyaçlarınızı açıklayın..."
                    rows={4}
                  />
                </div>
                <Button className="w-full bg-toz-green hover:bg-green-600 text-white">
                  Mesaj Gönder
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-toz-dark-gray text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-toz-green rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">TOZ YAPI</h3>
                  <p className="text-sm text-gray-300">TEKNOLOJİLERİ</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                2008'den beri yapı teknolojileri alanında yenilikçi çözümler sunuyoruz.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <Facebook className="w-5 h-5" />, href: "#" },
                  { icon: <Instagram className="w-5 h-5" />, href: "#" },
                  { icon: <Twitter className="w-5 h-5" />, href: "#" },
                  { icon: <Linkedin className="w-5 h-5" />, href: "#" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:bg-toz-green hover:text-white transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Hızlı Linkler</h4>
              <ul className="space-y-3">
                {navigationItems.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-300 hover:text-toz-green transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Ürünlerimiz</h4>
              <ul className="space-y-3 text-gray-300">
                <li>Panjur Sistemleri</li>
                <li>Kepenk Sistemleri</li>
                <li>Pergola & Tente</li>
                <li>Otomatik Kapı</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6">İletişim</h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +90 536 773 14 04
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  merhaba@tozyapi.com.tr
                </p>
                <p className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                  Bilkent Center AVM, Çankaya/ANKARA
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2025 TOZ Yapı Teknolojileri. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-toz-green hover:bg-green-600 text-white shadow-lg"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Luna AI Assistant (Placeholder) */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          className="w-14 h-14 rounded-full bg-toz-yellow hover:bg-yellow-400 text-gray-800 shadow-lg"
          size="sm"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

export default App

