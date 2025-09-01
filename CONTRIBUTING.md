# Contributing to Toz Yapı Updated

We welcome contributions to Toz Yapı Updated! This document provides guidelines for contributing to the project.

## 🇹🇷 Türkçe | 🇺🇸 English

**TR:** Toz Yapı Updated projesine katkıda bulunmaktan memnuniyet duyarız! Bu doküman projeye katkıda bulunma rehberini içerir.

**EN:** We welcome contributions to Toz Yapı Updated! This document provides guidelines for contributing to the project.

## 🚀 Getting Started / Başlangıç

### Prerequisites / Gereksinimler

- Node.js 18+ 
- npm 9+
- Git
- A GitHub account / GitHub hesabı

### Development Setup / Geliştirme Ortamı Kurulumu

1. **Fork the repository / Repoyu fork edin**
   ```bash
   # Click the "Fork" button on GitHub
   # GitHub'da "Fork" butonuna tıklayın
   ```

2. **Clone your fork / Fork'unuzu klonlayın**
   ```bash
   git clone https://github.com/YOUR_USERNAME/toz-yapi-updated.git
   cd toz-yapi-updated
   ```

3. **Install dependencies / Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

4. **Setup git hooks / Git kancalarını kurun**
   ```bash
   npm run prepare
   ```

5. **Create a feature branch / Özellik dalı oluşturun**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Workflow / Geliştirme İş Akışı

### Code Style / Kod Stili

We use ESLint and Prettier to maintain consistent code style.

ESLint ve Prettier kullanarak tutarlı kod stili sağlıyoruz.

```bash
# Check linting / Lint kontrolü
npm run lint

# Fix linting issues / Lint sorunlarını düzelt
npm run lint:fix

# Format code / Kodu formatla
npm run format

# Type checking / Tip kontrolü
npm run type-check
```

### Testing / Test

```bash
# Run all tests / Tüm testleri çalıştır
npm test

# Run tests in watch mode / İzleme modunda test çalıştır
npm run test:watch

# Run tests with coverage / Kapsama ile test çalıştır
npm run test:coverage
```

### Building / Derleme

```bash
# Build the project / Projeyi derle
npm run build

# Start development server / Geliştirme sunucusunu başlat
npm run dev
```

## 🐛 Reporting Bugs / Hata Bildirme

When reporting bugs, please include:

Hata bildirirken lütfen şunları ekleyin:

- **Clear description** / **Açık açıklama**
- **Steps to reproduce** / **Tekrarlama adımları**
- **Expected behavior** / **Beklenen davranış**
- **Actual behavior** / **Gerçek davranış**
- **Environment details** / **Ortam detayları**
- **Screenshots if applicable** / **Varsa ekran görüntüleri**

## ✨ Feature Requests / Özellik İstekleri

We welcome feature requests! Please:

Özellik isteklerini memnuniyetle karşılıyoruz! Lütfen:

- **Check existing issues first** / **Önce mevcut sorunları kontrol edin**
- **Provide clear use case** / **Açık kullanım durumu sağlayın**
- **Explain the problem it solves** / **Çözdüğü sorunu açıklayın**
- **Consider backward compatibility** / **Geriye dönük uyumluluğu düşünün**

## 🔄 Pull Request Process / Pull Request Süreci

1. **Update documentation** / **Dokümantasyonu güncelleyin**
   - Update README.md if needed
   - Add/update JSDoc comments
   - Update CHANGELOG.md

2. **Write tests** / **Test yazın**
   - Add unit tests for new features
   - Ensure all tests pass
   - Maintain or improve code coverage

3. **Follow commit conventions** / **Commit kurallarını takip edin**
   ```
   type(scope): description
   
   feat(cli): add new template command
   fix(core): resolve validation issue
   docs(readme): update installation guide
   test(utils): add FileManager tests
   ```

4. **Run validation** / **Doğrulama çalıştırın**
   ```bash
   npm run validate
   ```

5. **Create pull request** / **Pull request oluşturun**
   - Use clear title and description
   - Reference related issues
   - Add screenshots for UI changes

## 📋 Code Review Guidelines / Kod İnceleme Rehberi

### For Contributors / Katkıcılar İçin

- **Keep PRs small and focused** / **PR'ları küçük ve odaklı tutun**
- **Write clear commit messages** / **Açık commit mesajları yazın**
- **Respond to feedback promptly** / **Geri bildirimlere hızlı yanıt verin**
- **Update PR based on reviews** / **İncelemelere göre PR'ı güncelleyin**

### For Reviewers / İnceleyiciler İçin

- **Be constructive and respectful** / **Yapıcı ve saygılı olun**
- **Focus on code, not the person** / **Kişiye değil koda odaklanın**
- **Suggest improvements** / **İyileştirmeler önerin**
- **Test the changes** / **Değişiklikleri test edin**

## 🏗️ Project Structure / Proje Yapısı

```
src/
├── cli.ts              # CLI entry point / CLI giriş noktası
├── index.ts            # Main library export / Ana kütüphane
├── core/               # Core functionality / Ana işlevsellik
├── commands/           # CLI commands / CLI komutları
├── utils/              # Utilities / Yardımcılar
├── types/              # TypeScript types / TypeScript tipleri
└── templates/          # Project templates / Proje şablonları

tests/                  # Test files / Test dosyaları
docs/                   # Documentation / Dokümantasyon
examples/               # Usage examples / Kullanım örnekleri
```

## 🎯 Coding Standards / Kodlama Standartları

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Functions / Fonksiyonlar

- Keep functions small and focused
- Use pure functions when possible
- Handle errors appropriately
- Write descriptive function names

### Testing / Test

- Write tests for all new features
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

## 🌟 Recognition / Takdir

Contributors will be recognized in:

Katkıcılar şuralarda tanınacak:

- **README.md contributors section**
- **Release notes**
- **GitHub contributors page**

## 📞 Getting Help / Yardım Alma

If you need help:

Yardıma ihtiyacınız varsa:

- **Check the documentation** / **Dokümantasyonu kontrol edin**
- **Search existing issues** / **Mevcut sorunları arayın**
- **Create a discussion** / **Tartışma oluşturun**
- **Ask in pull request** / **Pull request'te sorun**

## 📄 License / Lisans

By contributing, you agree that your contributions will be licensed under the MIT License.

Katkıda bulunarak, katkılarınızın MIT Lisansı altında lisanslanacağını kabul etmiş olursunuz.

---

Thank you for contributing to Toz Yapı Updated! 🚀

Toz Yapı Updated'e katkıda bulunduğunuz için teşekkür ederiz! 🚀