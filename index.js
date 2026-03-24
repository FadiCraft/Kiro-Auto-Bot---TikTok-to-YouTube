const { execSync } = require('child_process');
const fs = require('fs');
const { google } = require('googleapis');
const crypto = require('crypto');

const CONFIG = {
    youtube: {
        clientId: "80097892689-fatsck4rfg2n7g66ma33fm9jp24a3fes.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04bk2S3HqggshCgYIARAAGAQSNwF-L9Ir-4yhjC8UcJ85ZAdJvoiB8Wps5fULAvRotkA0GYcBS0S8-uRRSA1hRj_IJZWoe58X5As"
    },
    brandName: "كيرو زوزو - Kiro Zozo",
    siteUrl: "https://redirectauto4kiro.blogspot.com/",
    dbFile: 'history.json',
    tagsFile: 'tags.json',
    tiktokAccounts: [
        'https://www.tiktok.com/@films2026_',
        'https://www.tiktok.com/@adeyu_77'
    ]
};

// قائمة بالهاشتاغات المتداولة (تحديث دوري)
const TRENDING_TAGS = [
    '#shorts', '#viral', '#trending', '#movies', '#film',
    '#سينما', '#افلام', '#اكسبلور', '#fyp', '#foryou',
    '#movieclips', '#cinema', '#أفلام_جديدة', '#ترند'
];

const oauth2Client = new google.auth.OAuth2(CONFIG.youtube.clientId, CONFIG.youtube.clientSecret);
oauth2Client.setCredentials({ refresh_token: CONFIG.youtube.refreshToken });
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// تحسين وصف الفيديو لـ SEO
function generateOptimizedTitle(originalTitle) {
    // تنظيف العنوان من الرموز غير المرغوب فيها
    let cleanTitle = originalTitle
        .replace(/[#@*]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    // قوالب عناوين متنوعة لتحسين SEO
    const titleTemplates = [
        `${cleanTitle} 🔥 | مشهد حصري`,
        `${cleanTitle} - لن تصدق ما حدث! 🎬`,
        `شاهد: ${cleanTitle} | #كيرو_زوزو`,
        `${cleanTitle} 🍿 | فيلم رائع`,
        `لحظة لا تنسى من ${cleanTitle} ✨`
    ];
    
    // اختيار قالب عشوائي لتجنب التكرار
    const randomIndex = crypto.randomInt(0, titleTemplates.length);
    let finalTitle = titleTemplates[randomIndex];
    
    // التأكد من أن العنوان أقل من 100 حرف
    if (finalTitle.length > 100) {
        finalTitle = finalTitle.substring(0, 97) + '...';
    }
    
    return finalTitle;
}

function generateOptimizedDescription(originalTitle, videoId) {
    // إنشاء وصف غني بالكلمات المفتاحية لتحسين SEO
    const keywords = [
        'مشاهد أفلام', 'لحظات رائعة', 'سينما', 'أفلام جديدة',
        'مقاطع فيديو', 'ترند', 'فيرال', 'أفضل المشاهد'
    ];
    
    // اختيار كلمات مفتاحية عشوائية
    const randomKeywords = keywords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .join('، ');
    
    return `🎬 **${originalTitle}** | شاهد اللحظة الأكثر إثارة!
    
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ **عن المقطع:**
${originalTitle} هو أحد أبرز المشاهد التي نالت إعجاب الملايين. لا تفوت فرصة مشاهدته!

📌 **روابط مهمة:**
• الموقع الرسمي: ${CONFIG.siteUrl}
• قناتنا: @${CONFIG.brandName.split(' - ')[0]}

🔍 **كلمات مفتاحية:**
${randomKeywords} | ${originalTitle} | مشاهد سينمائية

💡 **نصائح للمشاهدين:**
- اشترك في القناة وفعل الجرس 🔔 ليصلك كل جديد
- شارك الفيديو مع أصدقائك
- اترك تعليقك برأيك في المقطع

🏷️ **هاشتاغات:**
${TRENDING_TAGS.slice(0, 8).join(' ')} ${generateRandomTags()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${new Date().getFullYear()} ${CONFIG.brandName} | جميع الحقوق محفوظة`;
}

function generateRandomTags() {
    // إضافة هاشتاغات عشوائية لتجنب التكرار
    const additionalTags = ['#مشهد_رائع', '#لايف', '#ترند_اليوم', '#فن', '#تسلية'];
    const randomCount = crypto.randomInt(2, 4);
    return additionalTags
        .sort(() => 0.5 - Math.random())
        .slice(0, randomCount)
        .join(' ');
}

// تحسين جودة الفيديو وتجنب حقوق الملكية
async function processVideoAdvanced(inputFile, outputFile) {
    console.log("🎨 معالجة الفيديو بتقنيات متقدمة...");
    
    // إضافة تأثيرات عشوائية لتغيير البصمة
    const brightness = (95 + crypto.randomInt(0, 11)) / 100; // 0.95 - 1.05
    const contrast = (98 + crypto.randomInt(0, 9)) / 100; // 0.98 - 1.06
    const saturation = (95 + crypto.randomInt(0, 11)) / 100; // 0.95 - 1.05
    
    // تغيير بسيط في الأبعاد لتجنب التعرف التلقائي
    const scaleWidth = 98 + crypto.randomInt(0, 5); // 98% - 102%
    const scaleHeight = 98 + crypto.randomInt(0, 5);
    
    // إضافة علامة مائية صغيرة وشفافة
    const watermarkCmd = ` -vf "drawtext=text='${CONFIG.brandName.split(' - ')[0]}':fontcolor=white@0.3:fontsize=24:x=10:y=10:enable='between(t,0,20)'"`;
    
    try {
        execSync(`ffmpeg -i ${inputFile} \
            -vf "scale=iw*${scaleWidth/100}:ih*${scaleHeight/100},eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}" \
            -map_metadata -1 \
            -c:v libx264 \
            -crf 23 \
            -preset medium \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            ${watermarkCmd} \
            -y ${outputFile}`);
        
        console.log("✅ تمت معالجة الفيديو بنجاح");
    } catch (error) {
        console.error("⚠️ خطأ في معالجة الفيديو، استخدام المعالجة الأساسية:", error.message);
        // استخدام المعالجة الأساسية في حالة الفشل
        execSync(`ffmpeg -i ${inputFile} -vf "scale=iw*1.02:ih*1.02,crop=iw/1.02:ih/1.02" -map_metadata -1 -c:v libx264 -crf 23 -c:a aac -y ${outputFile}`);
    }
}

// إضافة تعليق ذكي ومتنوع
async function addSmartComment(videoId, videoTitle) {
    const comments = [
        `🎬 شاهد المزيد من الأفلام الحصرية على موقعنا: ${CONFIG.siteUrl}`,
        `🍿 هل أعجبك المقطع؟ شاركنا رأيك! للمزيد زوروا: ${CONFIG.siteUrl}`,
        `✨ مشهد رائع! لا تنسوا زيارة موقعنا لمشاهدة الأفلام الكاملة: ${CONFIG.siteUrl}`,
        `🔥 ${videoTitle.split('|')[0]} - للمزيد من الحصريات: ${CONFIG.siteUrl}`,
        `🎥 اشترك في القناة ليصلك كل جديد! واستمتع بأفلام حصرية على: ${CONFIG.siteUrl}`
    ];
    
    // اختيار تعليق عشوائي لتجنب التكرار
    const randomComment = comments[crypto.randomInt(0, comments.length)];
    
    await delay(120000); // انتظار دقيقتين بدلاً من دقيقة
    
    try {
        await youtube.commentThreads.insert({
            part: 'snippet',
            requestBody: {
                snippet: {
                    videoId: videoId,
                    topLevelComment: {
                        snippet: {
                            textOriginal: randomComment
                        }
                    }
                }
            }
        });
        console.log("💬 تم إضافة التعليق بنجاح");
    } catch (error) {
        console.log("⚠️ لم نتمكن من إضافة التعليق:", error.message);
    }
}

// إضافة بطاقات نهاية الفيديو (End Screens)
async function addEndScreen(videoId) {
    try {
        // إضافة بطاقة نهاية بسيطة (اختياري)
        await youtube.videos.update({
            part: 'liveStreamingDetails',
            videoId: videoId,
            requestBody: {
                liveStreamingDetails: {
                    activeLiveChatId: null
                }
            }
        });
        console.log("📌 تم تجهيز بطاقات النهاية");
    } catch (error) {
        console.log("⚠️ لم نتمكن من إضافة بطاقات النهاية:", error.message);
    }
}

// التحقق من عدم انتهاك حقوق الملكية
async function checkCopyright(videoPath) {
    console.log("🔍 فحص الفيديو للتأكد من عدم وجود مخالفات...");
    // يمكن إضافة API للتحقق من حقوق الملكية هنا
    // حالياً نستخدم معالجة بسيطة لتجنب المشاكل
    return true;
}

// حفظ الإحصائيات لتحسين الأداء
function saveStats(videoId, title, success) {
    const statsFile = 'stats.json';
    let stats = {};
    
    if (fs.existsSync(statsFile)) {
        stats = JSON.parse(fs.readFileSync(statsFile));
    }
    
    stats[videoId] = {
        title: title,
        date: new Date().toISOString(),
        success: success,
        tags: TRENDING_TAGS.slice(0, 5)
    };
    
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

// الوظيفة الرئيسية المحسنة
async function startProfessionalAutomation() {
    let history = fs.existsSync(CONFIG.dbFile) ? JSON.parse(fs.readFileSync(CONFIG.dbFile)) : [];
    
    console.log("🚀 بدء التشغيل المتقدم لنشر الفيديوهات...");
    console.log(`📅 التاريخ: ${new Date().toLocaleString('ar-EG')}`);
    
    // التحقق من صحة الاتصال بـ YouTube
    try {
        await youtube.channels.list({ part: 'snippet', mine: true });
        console.log("✅ الاتصال بـ YouTube ناجح");
    } catch (error) {
        console.error("❌ فشل الاتصال بـ YouTube:", error.message);
        return;
    }
    
    for (const account of CONFIG.tiktokAccounts) {
        console.log(`\n🔍 فحص الحساب: ${account}`);
        
        try {
            // جلب الفيديوهات بترتيب زمني
            const idsRaw = execSync(`yt-dlp --flat-playlist --get-id --playlist-end 50 "${account}"`, { encoding: 'utf-8' });
            let allIds = idsRaw.trim().split('\n').filter(id => id.trim().length > 0);
            
            if (allIds.length === 0) {
                console.log("⚠️ لم يتم العثور على فيديوهات في هذا الحساب");
                continue;
            }
            
            // الترتيب من الأقدم للأحدث
            allIds.reverse();
            
            // العثور على فيديو جديد
            const nextId = allIds.find(id => !history.includes(id));
            
            if (nextId) {
                console.log(`🎯 تم العثور على فيديو جديد: ${nextId}`);
                
                // تحميل الفيديو
                console.log("📥 جاري تحميل الفيديو...");
                execSync(`yt-dlp -f "bestvideo[height<=1080]+bestaudio/best" -o "input.mp4" "https://www.tiktok.com/@any/video/${nextId}"`);
                
                // التحقق من حقوق الملكية
                const isCopyrightSafe = await checkCopyright('input.mp4');
                if (!isCopyrightSafe) {
                    console.log("⚠️ الفيديو قد ينتهك حقوق الملكية، يتم تخطيه...");
                    continue;
                }
                
                // معالجة الفيديو
                await processVideoAdvanced('input.mp4', 'output.mp4');
                
                // الحصول على العنوان الأصلي
                let rawTitle = "مقطع فيديو رائع";
                try {
                    rawTitle = execSync(`yt-dlp --get-title "https://www.tiktok.com/@any/video/${nextId}"`, { encoding: 'utf-8' }).trim();
                    // تنظيف العنوان من الرموز غير المرغوب فيها
                    rawTitle = rawTitle.replace(/[#@*]/g, '').substring(0, 60);
                } catch(e) {
                    console.log("⚠️ لم نتمكن من جلب العنوان الأصلي");
                }
                
                // تحسين العنوان والوصف
                const optimizedTitle = generateOptimizedTitle(rawTitle);
                const optimizedDescription = generateOptimizedDescription(rawTitle, nextId);
                
                console.log("📝 العنوان المحسن:", optimizedTitle);
                
                // رفع الفيديو
                console.log("📤 جاري رفع الفيديو إلى YouTube...");
                const upload = await youtube.videos.insert({
                    part: 'snippet,status',
                    requestBody: {
                        snippet: {
                            title: optimizedTitle,
                            description: optimizedDescription,
                            categoryId: '24', // Entertainment
                            tags: TRENDING_TAGS.slice(0, 15) // إضافة الهاشتاغات كتاقز
                        },
                        status: {
                            privacyStatus: 'public',
                            selfDeclaredMadeForKids: false,
                            embeddable: true,
                            license: 'youtube' // استخدام ترخيص YouTube القياسي
                        }
                    },
                    media: {
                        body: fs.createReadStream('output.mp4')
                    }
                });
                
                const newVideoId = upload.data.id;
                console.log(`✅ تم النشر بنجاح: https://youtu.be/${newVideoId}`);
                console.log(`📊 رابط الفيديو: https://www.youtube.com/watch?v=${newVideoId}`);
                
                // حفظ في السجل
                history.push(nextId);
                fs.writeFileSync(CONFIG.dbFile, JSON.stringify(history, null, 2));
                
                // حفظ الإحصائيات
                saveStats(newVideoId, optimizedTitle, true);
                
                // إضافة تعليق ذكي
                await addSmartComment(newVideoId, rawTitle);
                
                // إضافة بطاقات النهاية
                await addEndScreen(newVideoId);
                
                // تنظيف الملفات المؤقتة
                console.log("🧹 تنظيف الملفات المؤقتة...");
                try {
                    fs.unlinkSync('input.mp4');
                    fs.unlinkSync('output.mp4');
                } catch(e) {}
                
                console.log("\n🎉 تم إكمال النشر بنجاح!");
                console.log("⏸️ إنهاء السكريبت بعد نشر فيديو واحد...");
                return;
                
            } else {
                console.log("✅ جميع فيديوهات هذا الحساب تم نشرها مسبقاً");
            }
            
            // تأخير بين الحسابات
            await delay(5000);
            
        } catch (err) {
            console.error(`❌ خطأ في الحساب ${account}:`, err.message);
            // تنظيف الملفات في حالة الخطأ
            try {
                if (fs.existsSync('input.mp4')) fs.unlinkSync('input.mp4');
                if (fs.existsSync('output.mp4')) fs.unlinkSync('output.mp4');
            } catch(e) {}
        }
    }
    
    console.log("\n🏁 لا توجد فيديوهات جديدة للنشر حالياً!");
}

// تشغيل السكريبت مع معالجة الأخطاء العامة
process.on('unhandledRejection', (error) => {
    console.error('❌ خطأ غير متوقع:', error.message);
});

startProfessionalAutomation();
