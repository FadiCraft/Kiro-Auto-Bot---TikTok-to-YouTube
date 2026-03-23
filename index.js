const { execSync } = require('child_process');
const fs = require('fs');
const { google } = require('googleapis');

// --- 1. الإعدادات (Config) ---
const CONFIG = {
    youtube: {
        clientId: "80097892689-fatsck4rfg2n7g66ma33fm9jp24a3fes.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04OySrfdvka32CgYIARAAGAQSNwF-L9IrDkZiwdv-6X0c9RfppP38Ngo-Rt0EW5TvZiNTJu3LvbI4VSIx_9NmS-DCaVVskB8yIhM"
    },
    brandName: "كيرو زوزو - Kiro Zozo",
    siteUrl: "https://redirectauto4kiro.blogspot.com/", // سيوضع في التعليق فقط
    dbFile: 'history.json',
    tiktokAccounts: [
        'https://www.tiktok.com/@films2026_',
        'https://www.tiktok.com/@adeyu_77'
    ]
};

const oauth2Client = new google.auth.OAuth2(CONFIG.youtube.clientId, CONFIG.youtube.clientSecret);
oauth2Client.setCredentials({ refresh_token: CONFIG.youtube.refreshToken });
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- 2. دوال الـ SEO والأمان ---

// بناء وصف غني بالكلمات المفتاحية وبدون روابط (SEO Friendly)
function buildSEODescription(title) {
    return `🎬 شاهد أجمل مقاطع الأفلام والمسلسلات الحصرية على قناة ${CONFIG.brandName}.\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `✨ نبذة عن المقطع:\n` +
           `${title}\n\n` +
           `🍿 إذا كنت تبحث عن مشاهدة الأفلام كاملة بجودة عالية، يمكنك البحث عن موقعنا الرسمي "كيرو زوزو" على جوجل.\n\n` +
           `💡 لا تنسى الاشتراك وتفعيل الجرس (🔔) لتصلك أحدث المقاطع اليومية.\n` +
           `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
           `🏷️ كلمات مفتاحية:\n` +
           `#كيرو_زوزو #kirozozo #أفلام #مشاهد_افلام #مسلسلات #Shorts #Movies #Trending #دراما #سينما`;
}

// دالة فحص أمان القناة
async function runSafetyCheck() {
    console.log("🛡️ فحص أمان القناة للفيديو السابق...");
    try {
        const searchRes = await youtube.search.list({ part: 'id', forMine: true, type: 'video', maxResults: 2, order: 'date' });
        const prevId = searchRes.data.items[1]?.id?.videoId;
        if (!prevId) return;

        const videoData = await youtube.videos.list({ part: 'status', id: prevId });
        if (videoData.data.items[0]?.status.uploadStatus === 'rejected') {
            console.log("⚠️ تم كشف مخالفة في الفيديو السابق، جاري الحذف...");
            await youtube.videos.delete({ id: prevId });
        }
    } catch (e) { console.log("ℹ️ الفحص تخطى لعدم وجود بيانات."); }
}

// --- 3. المحرك الرئيسي ---

async function startProfessionalAutomation() {
    let history = fs.existsSync(CONFIG.dbFile) ? JSON.parse(fs.readFileSync(CONFIG.dbFile)) : [];
    const account = CONFIG.tiktokAccounts[Math.floor(Math.random() * CONFIG.tiktokAccounts.length)];
    
    console.log(`🔍 جاري البحث في: ${account}`);

    try {
        const idsRaw = execSync(`yt-dlp --get-id --playlist-items 20 "${account}"`, { encoding: 'utf-8' });
        const allIds = idsRaw.trim().split('\n');
        const nextId = allIds.find(id => !history.includes(id));

        if (!nextId) {
            console.log("✅ الحساب مكتمل بالكامل.");
            return;
        }

        console.log(`🚀 معالجة احترافية للفيديو: ${nextId}`);

        // جلب العنوان وتنظيفه للسيو
        let rawTitle = execSync(`yt-dlp --get-title "https://www.tiktok.com/@any/video/${nextId}"`, { encoding: 'utf-8' }).trim().split('\n')[0];
        let seoTitle = `${rawTitle.substring(0, 60)} 🔥 #كيرو_زوزو`;

        // التحميل والمعالجة (تغيير البصمة)
        execSync(`yt-dlp -f "bestvideo[height<=1080]+bestaudio/best" -o "input.mp4" "https://www.tiktok.com/@any/video/${nextId}"`);
        console.log("🎨 معالجة الفيديو تقنياً...");
        execSync(`ffmpeg -i input.mp4 -vf "scale=iw*1.25:ih*1.25,crop=iw/1.25:ih/1.25,eq=brightness=0.02:contrast=1.05" -map_metadata -1 -c:v libx264 -crf 21 -c:a aac -y output.mp4`);

        // الرفع
        console.log("📤 جاري الرفع إلى يوتيوب (بدون روابط)...");
        const upload = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: seoTitle,
                    description: buildSEODescription(rawTitle),
                    tags: ['كيرو زوزو', 'kirozozo', 'أفلام', 'مسلسلات', 'Shorts', 'قصص افلام'],
                    categoryId: '24'
                },
                status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
            },
            media: { body: fs.createReadStream('output.mp4') }
        });

        const newId = upload.data.id;
        console.log(`✅ نُشر بنجاح: https://youtu.be/${newId}`);

        history.push(nextId);
        fs.writeFileSync(CONFIG.dbFile, JSON.stringify(history, null, 2));

        // فحص أمان القناة
        await runSafetyCheck();

        // --- الانتظار الذكي (3 دقائق) ---
        console.log("⏳ الانتظار لمدة 3 دقائق قبل إضافة الرابط (للحماية من السبام)...");
        await delay(180000); 

        console.log("💬 إضافة التعليق التوجيهي...");
        const commentMsg = `🍿 لمشاهدة الفيلم كامل أو تحميله بجودة عالية، تفضل بزيارة موقعنا الرسمي من هنا:\n\n🔗 ${CONFIG.siteUrl}\n\n✨ استمتعوا بالمشاهدة ولا تنسوا الاشتراك في عائلة كيرو زوزو ❤️`;
        
        await youtube.commentThreads.insert({
            part: 'snippet',
            requestBody: {
                snippet: {
                    videoId: newId,
                    topLevelComment: { snippet: { textOriginal: commentMsg } }
                }
            }
        });
        console.log("🎯 اكتملت العملية بنجاح وبأقصى درجات الأمان.");

    } catch (err) {
        console.error("⚠️ خطأ في النظام:", err.message);
    } finally {
        ['input.mp4', 'output.mp4'].forEach(f => { if(fs.existsSync(f)) fs.unlinkSync(f); });
    }
}

startProfessionalAutomation();
