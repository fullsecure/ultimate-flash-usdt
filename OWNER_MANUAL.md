# 📖 دليل المالك - Ultimate Flash USDT v2.1

## 🎯 **معلومات العقد الأساسية**

### **🔗 عنوان العقد:**
```
0x99f97c023D64435c61c92Ad129C73549D0446f3E
```

### **🌐 تفاصيل الشبكة:**
- **الشبكة:** BSC Mainnet (Binance Smart Chain)
- **Chain ID:** 56
- **Explorer:** https://bscscan.com/address/0x99f97c023D64435c61c92Ad129C73549D0446f3E
- **المالك:** 0xcD595fF4a3d6f6Ac2d5d08FA931d9b8F69bB925D

### **💰 تفاصيل التوكن:**
- **الاسم:** Tether USD
- **الرمز:** USDT
- **المنازل العشرية:** 6
- **الكمية الإجمالية:** 900,000,000 USDT
- **الإصدار:** Ultimate Flash USDT v2.1 - Trust Wallet Fixed

## 🔐 **الوظائف الأساسية للمالك**

### **1. Flash Minting (صك التوكنات)**

#### **صك فردي:**
```javascript
// صك توكنات لعنوان واحد
await contract.flashMint(recipientAddress, amount);

// مثال: صك 10,000 USDT
await contract.flashMint("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87", 10000000000); // 10,000 * 10^6
```

#### **صك مجمع (Batch Minting):**
```javascript
// صك لعدة عناوين في معاملة واحدة (توفير Gas)
const recipients = [
    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "0x8ba1f109551bD432803012645Hac136c9c1659e9"
];
const amounts = [
    5000000000,  // 5,000 USDT
    10000000000  // 10,000 USDT
];

await contract.batchFlashMint(recipients, amounts);
```

### **2. إدارة VIP (العناوين المميزة)**

#### **إضافة/إزالة VIP:**
```javascript
// إضافة عنوان كـ VIP (لا تنتهي صلاحية توكناته)
await contract.setVIPStatus("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87", true);

// إزالة حالة VIP
await contract.setVIPStatus("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87", false);

// التحقق من حالة VIP
const isVIP = await contract.isVIP("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87");
```

### **3. إدارة فترة الانتهاء**

#### **تغيير فترة الانتهاء:**
```javascript
// تغيير فترة الانتهاء (بالثواني)
await contract.setFlashPeriod(2592000); // 30 يوم
await contract.setFlashPeriod(604800);   // 7 أيام
await contract.setFlashPeriod(86400);    // يوم واحد

// الحد الأدنى: ساعة واحدة (3600 ثانية)
// الحد الأقصى: سنة واحدة (31536000 ثانية)
```

### **4. الضوابط الطارئة**

#### **تفعيل/إيقاف Flash Mode:**
```javascript
// إيقاف صك التوكنات مؤقتاً
await contract.toggleFlashMode();

// التحقق من حالة Flash Mode
const isEnabled = await contract.isFlashEnabled();
```

#### **تفعيل/إيقاف Stealth Mode:**
```javascript
// تفعيل الوضع الخفي (إخفاء بعض المعلومات)
await contract.toggleStealthMode();

// التحقق من حالة Stealth Mode
const isStealthMode = await contract.isStealthMode();
```

## 📊 **وظائف المراقبة والاستعلام**

### **1. معلومات النظام:**
```javascript
// الحصول على معلومات النظام الكاملة
const systemInfo = await contract.getSystemInfo();
console.log("الإصدار:", systemInfo[0]);
console.log("Flash مفعل:", systemInfo[1]);
console.log("فترة Flash:", systemInfo[2], "ثانية");
console.log("الوضع الخفي:", systemInfo[3]);
```

### **2. معلومات التوكن:**
```javascript
// الحصول على جميع معلومات التوكن
const metadata = await contract.getTokenMetadata();
console.log("الاسم:", metadata[0]);
console.log("الرمز:", metadata[1]);
console.log("المنازل:", metadata[2]);
console.log("الكمية الإجمالية:", metadata[3]);
console.log("عدد الشعارات:", metadata[4].length);
console.log("السعر USD:", metadata[5]);
console.log("API السعر:", metadata[6]);
```

### **3. معلومات Trust Wallet:**
```javascript
// بيانات Trust Wallet المحسنة
const trustWalletData = await contract.getTrustWalletData();
console.log("اسم العقد:", trustWalletData[0]);
console.log("رمز العقد:", trustWalletData[1]);
console.log("الشعار الرسمي:", trustWalletData[2]);
console.log("المنازل:", trustWalletData[3]);
console.log("رابط Explorer:", trustWalletData[4]);
```

### **4. فحص انتهاء الصلاحية:**
```javascript
// التحقق من انتهاء صلاحية عنوان معين
const expiry = await contract.getFlashExpiry("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87");
const isExpired = await contract.isFlashExpired("0x742d35Cc6634C0532925a3b8D4C9db96590c6C87");

console.log("تاريخ الانتهاء:", new Date(expiry * 1000));
console.log("منتهي الصلاحية:", isExpired);
```

## 🎨 **الميزات المتقدمة**

### **1. نظام الشعارات المتعدد:**
```javascript
// الحصول على أفضل شعار (Tether الرسمي)
const bestLogo = await contract.getBestLogo();

// الحصول على جميع الشعارات (4 شعارات)
const allLogos = await contract.getAllLogos();
console.log("عدد الشعارات المتاحة:", allLogos.length);
```

### **2. Price Oracle:**
```javascript
// الحصول على السعر بالدولار
const priceUSD = await contract.getPriceUSD();
console.log("السعر:", priceUSD / 1000000, "USD"); // تحويل من 6 منازل

// الحصول على API السعر
const priceAPI = await contract.getPriceAPI();
console.log("API السعر:", priceAPI);
```

## ⚠️ **قواعد مهمة للاستخدام**

### **🔒 قواعد الأمان:**
1. **المالك معفي من الانتهاء** - توكناتك لا تنتهي صلاحيتها أبداً
2. **VIP معفيون من الانتهاء** - العناوين المميزة محمية
3. **التحقق من المدخلات** - جميع المدخلات محققة تلقائياً
4. **حماية ReentrancyGuard** - منع الهجمات المتقدمة

### **📏 الحدود والقيود:**
- **Flash Period:** من ساعة واحدة إلى سنة واحدة
- **Batch Minting:** حد أقصى 100 عنوان في المعاملة الواحدة
- **Amount:** يجب أن يكون أكبر من صفر
- **Address:** لا يمكن أن يكون عنوان فارغ (0x0)

### **⚡ نصائح لتوفير Gas:**
1. **استخدم Batch Minting** للعناوين المتعددة
2. **اجمع العمليات** في معاملة واحدة عند الإمكان
3. **استخدم Gas Price منخفض** في الأوقات الهادئة

## 🔧 **استكشاف الأخطاء**

### **أخطاء شائعة وحلولها:**

#### **"Flash minting disabled"**
```javascript
// تحقق من حالة Flash Mode
const isEnabled = await contract.isFlashEnabled();
if (!isEnabled) {
    await contract.toggleFlashMode(); // تفعيل Flash Mode
}
```

#### **"Flash tokens expired"**
```javascript
// إضافة العنوان كـ VIP لمنع الانتهاء
await contract.setVIPStatus(address, true);
```

#### **"Arrays length mismatch"**
```javascript
// تأكد من أن عدد العناوين = عدد الكميات في Batch Minting
const recipients = ["0x...", "0x..."];
const amounts = [1000000000, 2000000000]; // نفس العدد
```

#### **"Too many recipients"**
```javascript
// قسم العناوين إلى مجموعات أصغر (100 عنوان كحد أقصى)
const batchSize = 100;
for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const batchAmounts = amounts.slice(i, i + batchSize);
    await contract.batchFlashMint(batch, batchAmounts);
}
```

## 📱 **إضافة التوكن للمحافظ**

### **Trust Wallet (تلقائي بعد موافقة PR):**
- سيظهر الشعار تلقائياً لجميع المستخدمين
- السعر سيظهر بعد تسجيل CoinGecko

### **إضافة يدوية (فورية):**
```
Contract: 0x99f97c023D64435c61c92Ad129C73549D0446f3E
Symbol: USDT
Decimals: 6
Logo: https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png
```

### **صفحة الإضافة المحسنة:**
```
https://benevolent-longma-082868.netlify.app/mobile-add-token.html
```

## 🎯 **أمثلة عملية للاستخدام**

### **سيناريو 1: صك توكنات لعميل واحد**
```javascript
// صك 50,000 USDT لعميل
const recipient = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87";
const amount = 50000 * 1000000; // 50,000 USDT
await contract.flashMint(recipient, amount);
```

### **سيناريو 2: صك توكنات لعدة عملاء**
```javascript
// صك لـ 5 عملاء بكميات مختلفة
const recipients = [
    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87", // 10,000 USDT
    "0x8ba1f109551bD432803012645Hac136c9c1659e9", // 25,000 USDT
    "0x123...", // 5,000 USDT
    "0x456...", // 15,000 USDT
    "0x789..."  // 30,000 USDT
];

const amounts = [
    10000000000, // 10,000 * 10^6
    25000000000, // 25,000 * 10^6
    5000000000,  // 5,000 * 10^6
    15000000000, // 15,000 * 10^6
    30000000000  // 30,000 * 10^6
];

await contract.batchFlashMint(recipients, amounts);
```

### **سيناريو 3: إدارة VIP للعملاء المميزين**
```javascript
// إضافة عملاء VIP (توكناتهم لا تنتهي)
const vipClients = [
    "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    "0x8ba1f109551bD432803012645Hac136c9c1659e9"
];

for (const client of vipClients) {
    await contract.setVIPStatus(client, true);
}
```

## 🚨 **تحذيرات مهمة**

### **⚠️ احتياطات الأمان:**
1. **احتفظ بالمفتاح الخاص آمناً** - أنت المالك الوحيد
2. **تحقق من العناوين** قبل الصك
3. **استخدم كميات صحيحة** (6 منازل عشرية)
4. **راقب Gas Fees** في الشبكة

### **⚠️ قيود قانونية:**
- هذا العقد للأغراض التعليمية والاختبار
- لا يمثل USDT الحقيقي من Tether
- استخدم بمسؤولية وفقاً للقوانين المحلية

## 📞 **الدعم والمساعدة**

### **🔗 روابط مفيدة:**
- **BSCScan:** https://bscscan.com/address/0x99f97c023D64435c61c92Ad129C73549D0446f3E
- **Token List:** https://benevolent-longma-082868.netlify.app/ultimate-flash-usdt-tokenlist.json
- **Mobile Add Page:** https://benevolent-longma-082868.netlify.app/mobile-add-token.html
- **Price API:** https://benevolent-longma-082868.netlify.app/price-api.json

### **📊 مراقبة العقد:**
- راقب المعاملات على BSCScan
- تحقق من الأرصدة بانتظام
- راقب انتهاء صلاحية التوكنات

---

**🎊 تهانينا! لديك الآن أقوى عقد Flash USDT على الإطلاق مع جميع الميزات المتقدمة!**
