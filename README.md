# İşletme Yönetim Sistemi API - MongoDB Versiyonu

Bu proje, işletmeler için kapsamlı bir yönetim sistemi API'si sunmaktadır. MySQL yerine MongoDB Atlas kullanan versiyondur.

## Özellikler

### 1. Firma Yönetimi
- **Firma Kaydı ve Girişi**: Sistemde birden fazla firma hesabı oluşturabilme
- **Firma Bilgilerini Güncelleme**: İletişim bilgileri, adres vb. güncelleme
- **Firma Profili Görüntüleme**: Firma detaylarını görüntüleme

### 2. Kullanıcı Yönetimi
- **Kullanıcı Oluşturma**: Farklı yetkilere sahip çalışanlar ekleme (admin, manager, employee)
- **Kullanıcı Listesi**: Firmada çalışanların listesini görüntüleme
- **Kullanıcı Girişi**: Çalışanların kendi hesaplarıyla giriş yapabilmesi

### 3. Ürün ve Kategori Yönetimi
- **Kategori Oluşturma/Listeleme/Güncelleme/Silme**: Ürünleri kategorilere ayırma
- **Ürün Oluşturma/Listeleme/Güncelleme/Silme**: Detaylı ürün bilgileri kaydetme
- **Kategori Bazlı Ürün Filtreleme**: Belirli bir kategorideki ürünleri görüntüleme
- **Stok Takibi**: Ürünlerin stok miktarlarını yönetme

### 4. Müşteri Yönetimi
- **Müşteri Oluşturma/Listeleme/Güncelleme/Silme**: Müşteri bilgilerini kaydetme
- **Müşteri Arama**: İsim, e-posta veya telefon numarasına göre müşterileri arama

### 5. Masa Yönetimi
- **Masa Oluşturma/Listeleme/Güncelleme/Silme**: Restoran/kafe işletmelerinde masa yönetimi
- **Masa Durumu Güncelleme**: Masaları "available", "occupied" veya "reserved" olarak işaretleme
- **Masa Kapasitesi Takibi**: Her masanın kaç kişilik olduğunu belirleme

### 6. Sipariş Yönetimi
- **Sipariş Oluşturma**: Müşteriler ve masalar için siparişler oluşturma
- **Sipariş Listeleme**: Tüm siparişleri veya duruma göre filtrelenmiş siparişleri görme
- **Sipariş Detay Görüntüleme**: Sipariş içeriğini ve öğeleri detaylı inceleme
- **Sipariş Durumu Güncelleme**: Siparişleri "pending", "preparing", "completed" veya "cancelled" olarak işaretleme
- **Siparişe Ürün Ekleme**: Mevcut bir siparişe yeni ürünler ekleme
- **Masa Bazlı Aktif Sipariş**: Bir masadaki aktif siparişi görüntüleme

### 7. Fatura Yönetimi
- **Fatura Oluşturma**: Tamamlanan siparişler için fatura oluşturma
- **Fatura Numarası Otomatik Üretme**: Sistem otomatik olarak sıralı fatura numaraları üretir
- **Fatura Listeleme**: Tüm faturaları veya ödeme durumuna göre filtrelenmiş faturaları görme
- **Fatura Detay Görüntüleme**: Fatura içeriğini ve bağlı siparişi detaylı inceleme
- **Fatura Durumu Güncelleme**: Fatura durumunu "pending", "paid" veya "cancelled" olarak değiştirme
- **Sipariş Bazlı Fatura Görüntüleme**: Bir siparişe ait faturayı bulma

### 8. Ödeme Yönetimi
- **Ödeme Kaydetme**: Faturalar için ödeme kaydetme (tam veya kısmi ödemeler)
- **Ödeme Yöntemi Belirtme**: "cash", "credit_card" veya "bank_transfer" gibi ödeme yöntemleri kullanma
- **Ödeme Listeleme**: Tüm ödemeleri görüntüleme
- **Toplam Ödeme Kontrolü**: Bir fatura için yapılan toplam ödeme miktarı kontrol edilir
- **Otomatik Fatura Durumu Güncelleme**: Ödeme tamamlandığında fatura durumu otomatik olarak güncellenir
- **Ödeme İptali**: Hatalı girilen ödemeleri iptal etme
- **Fatura Bazlı Ödeme Özeti**: Bir faturaya ait tüm ödemeleri ve kalan tutarı görüntüleme

### 9. Stok Yönetimi
- **Stok Takibi**: Her ürün için detaylı stok bilgisi tutma
- **Stok Hareketleri**: Giriş/çıkış işlemlerinin detaylı kaydı
- **Minimum/Maksimum Stok**: Ürünler için minimum ve maksimum stok seviyesi belirleme
- **Stok Uyarıları**: Minimum stok seviyesinin altına düşüldüğünde uyarı
- **Birim Yönetimi**: Adet, kg, lt, paket gibi farklı birim tipleri
- **Stok Geçmişi**: Her ürün için detaylı stok hareket geçmişi
- **Hareket Nedenleri**: Satış, iade, fire, sayım, transfer gibi hareket tipleri
- **Lokasyon Takibi**: Stokların bulunduğu lokasyonları kaydetme
- **Sipariş Entegrasyonu**: Siparişlerle otomatik stok düşümü
- **Kullanıcı Bazlı İzleme**: Hangi kullanıcının hangi stok hareketini yaptığını takip

### 10. Personel Yönetimi
- **Vardiya Sistemi**: Personel vardiya planlaması ve takibi
- **Vardiya Tipleri**: Sabah, akşam, gece ve tam gün vardiyaları
- **Mesai Takibi**: Normal ve fazla mesai süreleri hesaplama
- **Mola Yönetimi**: Vardiya içi mola sürelerinin kaydı
- **İzin Yönetimi**: Yıllık, hastalık, ücretsiz ve idari izin takibi
- **İzin Hakları**: Personel bazlı izin hakkı kontrolü
- **Onay Mekanizması**: İzin talepleri için onay süreci
- **Belge Yönetimi**: İzin belgelerinin dijital olarak saklanması
- **Vardiya Değişimi**: Personel arası vardiya değişim takibi
- **Devam Takibi**: Personel giriş-çıkış kayıtları

### 11. Güvenlik Özellikleri
- **JWT Tabanlı Kimlik Doğrulama**: Tüm API istekleri için token gereklidir
- **Şifre Hashleme**: Kullanıcı ve firma şifreleri bcrypt ile güvenli bir şekilde hashlenir
- **Yetki Kontrolü**: Farklı kullanıcı rolleri için erişim kontrolleri
- **Veri İzolasyonu**: Her firma sadece kendi verilerine erişebilir

### Mutfak/Bar Yönetim Sistemi

#### Özellikler
- **Sipariş Takibi**
  - Siparişlerin anlık durumlarını görüntüleme
  - Ürün bazlı durum takibi
  - Hazırlanma süreleri izleme
  - Otomatik durum güncellemeleri

- **Önceliklendirme Sistemi**
  - Siparişlere öncelik atama (normal, yüksek, acil)
  - Önceliğe göre sıralama ve filtreleme
  - Dinamik öncelik güncelleme

- **Personel Yönetimi**
  - Siparişleri personele atama
  - Personel bazlı iş yükü takibi
  - Performans izleme

- **Zaman Yönetimi**
  - Başlangıç ve bitiş zamanları kaydı
  - Hazırlanma süresi hesaplama
  - Tahmini teslim süreleri

#### API Endpoints

##### Mutfak Siparişleri
- `POST /api/kitchen/orders` - Yeni mutfak siparişi oluşturma
  ```json
  {
    "orderId": "order_id",
    "items": [
      {
        "productId": "product_id",
        "quantity": 2,
        "notes": "Az pişmiş"
      }
    ]
  }
  ```

- `GET /api/kitchen/orders` - Tüm mutfak siparişlerini listeleme
- `GET /api/kitchen/orders/active` - Aktif siparişleri listeleme

##### Sipariş Durumu
- `PUT /api/kitchen/orders/:orderId/status` - Sipariş durumunu güncelleme
  ```json
  {
    "status": "hazırlanıyor",
    "itemIndex": 0  // Opsiyonel, belirli bir ürünü güncellemek için
  }
  ```

##### Öncelik Yönetimi
- `PUT /api/kitchen/orders/:orderId/priority` - Sipariş önceliğini güncelleme
  ```json
  {
    "priority": "yüksek"
  }
  ```

##### Personel Ataması
- `PUT /api/kitchen/orders/:orderId/assign` - Siparişi personele atama
  ```json
  {
    "staffId": "staff_id"
  }
  ```

#### Durum Kodları
- `beklemede` - Sipariş henüz hazırlanmaya başlanmadı
- `hazırlanıyor` - Sipariş mutfakta hazırlanıyor
- `hazır` - Sipariş servise hazır
- `teslim_edildi` - Sipariş masaya teslim edildi
- `iptal` - Sipariş iptal edildi

#### Öncelik Seviyeleri
- `normal` - Standart sipariş önceliği
- `yüksek` - Öncelikli sipariş
- `acil` - Acil hazırlanması gereken sipariş

## Teknolojiler

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT Authentication
- bcryptjs - Şifre hashleme
- dotenv - Çevre değişkenleri yönetimi

## Kurulum

1. Bu repoyu klonlayın
2. Gerekli paketleri yükleyin
```
npm install
```
3. `.env` dosyasını düzenleyin (MongoDB Atlas bilgilerinizi ekleyin)
```
PORT=3001
MONGODB_URI=mongodb+srv://<kullanıcı_adı>:<şifre>@cluster0.xxxxxx.mongodb.net/business_management_system?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```
4. Sunucuyu başlatın
```
npm run dev
```

## MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun
3. Database Access bölümünden bir kullanıcı oluşturun
4. Network Access bölümünden uygulamanızın erişebileceği IP adreslerini ekleyin (Geliştirme için 0.0.0.0/0 ekleyebilirsiniz)
5. Cluster'a bağlanmak için Connection String'i alın ve `.env` dosyasına ekleyin

## API Kullanımı

### Firma İşlemleri
- `POST /api/companies/register` - Firma kaydı
- `POST /api/companies/login` - Firma girişi
- `GET /api/companies/profile` - Firma profili görüntüleme
- `PUT /api/companies/profile` - Firma profili güncelleme

### Kullanıcı İşlemleri
- `POST /api/users` - Yeni kullanıcı oluşturma (firma yetkisi gerekli)
- `POST /api/users/login` - Kullanıcı girişi
- `GET /api/users` - Kullanıcıları listeleme (firma yetkisi gerekli)
- `GET /api/users/profile` - Kullanıcı profili görüntüleme

### Ürün Kategorisi İşlemleri
- `POST /api/product-categories` - Kategori oluşturma
- `GET /api/product-categories` - Kategorileri listeleme
- `GET /api/product-categories/:id` - Kategori detayı görüntüleme
- `PUT /api/product-categories/:id` - Kategori güncelleme
- `DELETE /api/product-categories/:id` - Kategori silme

### Ürün İşlemleri
- `POST /api/products` - Ürün oluşturma
- `GET /api/products` - Ürünleri listeleme
- `GET /api/products/:id` - Ürün detayı görüntüleme
- `PUT /api/products/:id` - Ürün güncelleme
- `DELETE /api/products/:id` - Ürün silme
- `GET /api/products/category/:categoryId` - Kategori bazlı ürünleri görüntüleme

### Müşteri İşlemleri
- `POST /api/customers` - Müşteri oluşturma
- `GET /api/customers` - Müşterileri listeleme
- `GET /api/customers/:id` - Müşteri detayı görüntüleme
- `PUT /api/customers/:id` - Müşteri güncelleme
- `DELETE /api/customers/:id` - Müşteri silme
- `GET /api/customers/search` - Müşteri arama

### Masa İşlemleri
- `POST /api/tables` - Masa oluşturma
- `GET /api/tables` - Masaları listeleme
- `GET /api/tables/:id` - Masa detayı görüntüleme
- `PUT /api/tables/:id` - Masa güncelleme
- `DELETE /api/tables/:id` - Masa silme
- `PUT /api/tables/:id/status` - Masa durumu güncelleme

### Sipariş İşlemleri
- `POST /api/orders` - Sipariş oluşturma
- `GET /api/orders` - Siparişleri listeleme
- `GET /api/orders/:id` - Sipariş detayı görüntüleme
- `PUT /api/orders/:id/status` - Sipariş durumu güncelleme
- `POST /api/orders/:id/items` - Siparişe ürün ekleme
- `GET /api/orders/table/:tableId/active` - Masa bazlı aktif sipariş görüntüleme

### Fatura İşlemleri
- `POST /api/invoices` - Fatura oluşturma
- `GET /api/invoices` - Faturaları listeleme
- `GET /api/invoices/:id` - Fatura detayı görüntüleme
- `PUT /api/invoices/:id/status` - Fatura durumu güncelleme
- `GET /api/invoices/order/:orderId` - Sipariş bazlı fatura görüntüleme

### Ödeme İşlemleri
- `POST /api/payments` - Ödeme oluşturma
- `GET /api/payments` - Ödemeleri listeleme
- `GET /api/payments/:id` - Ödeme detayı görüntüleme
- `PUT /api/payments/:id/cancel` - Ödeme iptal etme
- `GET /api/payments/invoice/:invoiceId` - Fatura bazlı ödemeleri görüntüleme

### Stok İşlemleri
- `GET /api/stocks` - Tüm stokları listeleme
- `POST /api/stocks` - Yeni stok kaydı oluşturma
- `PUT /api/stocks/:id` - Stok bilgilerini güncelleme
- `DELETE /api/stocks/:id` - Stok kaydını silme
- `GET /api/stocks/:id/history` - Stok geçmişini görüntüleme
- `POST /api/stocks/:id/movements` - Stok hareketi ekleme

### Vardiya İşlemleri
- `GET /api/staff/shifts` - Vardiya listesi
- `POST /api/staff/shifts` - Yeni vardiya oluştur
- `PUT /api/staff/shifts/:id` - Vardiya güncelle
- `DELETE /api/staff/shifts/:id` - Vardiya sil

### İzin İşlemleri
- `GET /api/staff/leaves` - İzin listesi
- `POST /api/staff/leaves` - Yeni izin talebi
- `PUT /api/staff/leaves/:id` - İzin güncelle/onayla
- `DELETE /api/staff/leaves/:id` - İzin talebi sil

## Kullanım Örnekleri ve Notlar

- Yeni bir sipariş oluşturduğunuzda, ilgili masanın durumu otomatik olarak "occupied" (dolu) olarak güncellenir.
- Sipariş tamamlandığında veya iptal edildiğinde, ilgili masanın durumu otomatik olarak "available" (uygun) olarak güncellenir.
- Fatura oluşturmak için önce sipariş durumunu "completed" olarak ayarlamanız gerekmektedir.
- Bir fatura için birden fazla kısmi ödeme yapılabilir, ancak toplam ödeme tutarı fatura tutarını aşamaz.
- Ödeme tam olarak tamamlandığında, fatura durumu otomatik olarak "paid" (ödenmiş) olarak güncellenir.

## Potansiyel Kullanım Alanları

- **Restoran/Kafe Yönetimi**: Masa, sipariş ve ödeme akışı restoran işletmeleri için uygundur
- **Perakende Mağaza Yönetimi**: Ürün, stok ve müşteri yönetimi perakende işletmeler için kullanılabilir
- **Fatura ve Ödeme Takibi**: Herhangi bir işletme türü için fatura ve ödeme takibini kolaylaştırır 