
# Kaktüs Bot

## Kullanılan Teknolojiler

**Tekonolojiler:** Discord.js, Canvas, Chalk, Discord-canvas, Dotenv, Moment, Mongoose v.

**Sunucu:** Şuanlık Sadece Node, İlerisi İçin Express de Kullanılacak


## Yükleme 

### Git Clone 
```bash
  git clone https://github.com/yunus-acar/kaktus-bot.git
  cd kaktus-bot
```
### Kaktüs Botu🌵 npm veya yarn  kullanarak paketleri kurabilirsin
```bash
  npm install yada yarn install
```

`.env` dosyası oluşturun ve içerisine mongodb bağlantı linkinizi ve discord tokenınızı yazabilirsin.
```env
TOKEN = discord-tokenınızı-yazın
DATABASE_URL = mongodb-bağlantı-linki
```

## Çalıştırma
```bash
yarn dev || yarn start
npm run dev || npm run start
``` 
yazarak çalıştırabilirsin.


### Admin Komutları
|Komutlar| Açıklamalar |
|--|--|
|addcommand - delcommand|Sunucuya özel yeni komut eklemeye ve silmeye yarar|
|addemoji|Sunucuya özel emoji eklemeye yarar|
|automod|Sunucuya atılan discord davetlerini siler|
|autorole|Sunucuya katılan kişilere oto rol verir|
|configuration|Genel sunucu ayarlarını kontrol eder|
|deletemod|Otomatik moderasyon komutlarını siler|
|goodbye|Sunucudan çıkanlar için mesaj atar|
|ignore|Komutların çalışmayacağı odayı seçtirir|
|setlang|Dil değiştirmek için|
|setmodlogs|Moderatör loglarını sunar|
|setprefix|Prefixi değiştirmek için|
|setreports|Sunucuda report sistemini ayarlar|
|setsuggests|Sunucuda öneriler sistemini ayarlar|
|slowmode|Kanalı slow mod'a ayarlar|
|welcome|Sunucuya katılanlar için mesaj atar|


### Eğlence Komutları
|Komutlar| Açıklamalar |
|--|--|
|ascii|İstediğiniz bir mesajı ascii karakter e çevir|
|choice|Verilen seçenekler arasında seçim yapmanıza yardımcı olur|


### Genel Komutlar
|Komutlar| Açıklamalar |
|--|--|
|help|Komut listesini veya belirli komut yardımını gösterin.|
|remindme|Kişisel bir hatırlatıcı ekle|
|report|Şikayetinizi gönderin!|
|setafk|AFK ol (Buna tepki veren üyelere mesaj gider)|
|staff|Sunucudaki yetkilileri listeler!|
|suggest|Sunucu için önerinizi gönderin!|


### Mod Komutları
|Komutlar| Açıklamalar |
|--|--|
|announcement|Bulunan kanala duyuru mesajı gönder!|
|ban|Etiketli üyeyi yasakla!|
|checkinvites|Hangi üyenin discord a ne kadar üye getirdiğini gör!|
|clear-sanctions|Üye önerilerini temizler!|
|clear|Hızlıca tüm mesajları sil!|
|giveaway|Kolayca çekilişlerini yönet!|
|kick|Etiketli üyeyi sunucudan at!|
|mute|Bir üyenin mesaj göndermesini ve belirli bir süre için sesli sohbet odasına bağlanmasını engeller!|
|sanctions|Bir üye tarafından işlenen uyarıların listesini görüntüler!|
|setwarns|Üyelerin belirli sayıda uyarıdan sonra alacakları cezaları ayarlayın!|
|unban|Üyenin yasağını kaldır!|
|unmute|Etiketli üyenin susturulmasını kaldır!|
|warn|Özel mesaj yoluyla üyeyi uyar|


### Music Komutları
|Komutlar| Açıklamalar |
|--|--|
|autoplay|Otomatik oynatma özelliğini etkinleştirin veya devre dışı bırakın|
|back|Önceki şarkıyı çal|
|filter|Filtreyi aç/kapat!|
|filters|Tüm filtrelerin listesini ve durumlarına bakın|
|lyrics|Şarkının sözlerini göster|
|np|Şuan ki şarkı hakkında bilgi gösterir!|
|pause|Şuan ki şarkıyı durdur!|
|play|Senin için müzik oynatabilirim!|
|queue|Sunucudaki müzik listesini gösterir|
|resume|Şuan ki şarkıyı dinlemeye devam et!|
|skip|Şuan ki şarkıyı geç|
|stop|Müziği Durdur|


### Resim Komutları
|Komutlar| Açıklamalar |
|--|--|
|avatar|Etiketlenmiş üyenin profil resmini gösterir|
|maya|Etiketlenmiş üyenin profil resmini arı maya resmine ekler|


`npm run dev` ya da `yarn dev` için `nodemon` indirmen gerekiyor.

### Nodemon Kurulumu

```bash 
yarn global add nodemon --prefix /usr/local || npm install --global nodemon
```

![Logo](https://res.cloudinary.com/dgr6spsst/image/upload/c_scale,w_250/v1621794612/kaktus-bot-logo.png)

