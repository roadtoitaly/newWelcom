const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

process.on('uncaughtException', err => console.error('\n🚨 [Uncaught Exception]:', err));
process.on('unhandledRejection', err => console.error('\n🚨 [Unhandled Rejection]:', err));

const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx8u48FlP0FEYnkE5bQN-pqk4tmLHglzrHuukJiX3eWOkp_7wi5AgpSMT4UtxSoWMVV/exec';
const SESSIONS_FILE = './sessions.json';

let userSessions = {};

// Restore saved sessions on startup
if (fs.existsSync(SESSIONS_FILE)) {
  try {
    userSessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
    console.log('📂 Previous sessions restored successfully.');
  } catch (error) {
    console.error('❌ Error reading session file, starting with empty state.');
    userSessions = {};
  }
}

function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(userSessions, null, 2));
  } catch (error) {
    console.error('❌ Error saving sessions:', error.message);
  }
}

const TIMEOUT_MINUTES = 10;
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000;

const messageTimestamps = {};
const SPAM_WINDOW_MS = 1000;

const isNumber = (text) => /^\d+$/.test(String(text).trim());
const isValidOption = (text, max) => {
  const value = Number(String(text).trim());
  return Number.isInteger(value) && value >= 1 && value <= max;
};

const questions = [
  {
    key: 'name',
    text: 'أهلاً بك في *ROAD to ITALY*! 🇮🇹✨\nنحن هنا لنضعك على أول طريق حلمك بالدراسة في إيطاليا.\n\nلنتمكن من مساعدتك بأفضل شكل، نحتاج لبعض التفاصيل البسيطة.\n\n👤 *مبدئياً.. ما هو اسمك الثلاثي؟*',
    validate: (text) => String(text).trim().length >= 5,
    error: '⚠️ الاسم يبدو قصيراً، يرجى كتابة اسمك الثلاثي بوضوح.'
  },
  {
    key: 'age',
    text: 'مرحباً بك يا [NAME]! 🤩\n\n🎂 *كم عمرك الآن؟*\n(يرجى كتابة أرقام فقط)',
    validate: (text) => isNumber(text) && Number(text) >= 15 && Number(text) <= 60,
    error: '⚠️ يرجى كتابة السن كرقم صحيح (مثال: 22).'
  },
  {
    key: 'phone',
    text: '📱 *ما هو رقم الموبايل أو الواتساب الأفضل للتواصل معك؟*',
    validate: (text) => String(text).trim().length >= 10,
    error: '⚠️ يرجى كتابة رقم موبايل صحيح.'
  },
  {
    key: 'governorate',
    text: '🌍 *من أي محافظة أنت؟*',
    validate: (text) => String(text).trim().length >= 3,
    error: '⚠️ يرجى كتابة اسم المحافظة بشكل واضح.'
  },
  {
    key: 'faculty',
    text: '🏛️ *ما هي كليتك أو تخصصك الدراسي الحالي؟*',
    validate: (text) => String(text).trim().length >= 3,
    error: '⚠️ يرجى كتابة التخصص بوضوح.'
  },
  {
    key: 'language_cert',
    text: '🗣️ *هل تمتلك شهادة لغة معتمدة (مثل IELTS أو TOEFL)؟*\n\nيرجى الرد برقم الاختيار:\n\n1️⃣ نعم، أمتلك شهادة.\n2️⃣ لا، لا أمتلك.\n3️⃣ أستعد للامتحان حالياً.',
    validate: (text) => isValidOption(text, 3),
    error: '⚠️ يرجى كتابة رقم الاختيار الصحيح (1 أو 2 أو 3 فقط).'
  },
  {
    key: 'study_language',
    text: '📚 *ما هي لغة دراستك في المرحلة الثانوية أو الجامعية؟*\n\n1️⃣ اللغة العربية\n2️⃣ اللغة الإنجليزية',
    validate: (text) => isValidOption(text, 2),
    error: '⚠️ يرجى كتابة رقم الاختيار (1 أو 2).'
  },
  {
    key: 'goal',
    text: '🎯 *ما هو هدفك الأساسي من السفر إلى إيطاليا؟*\n\n1️⃣ دراسة البكالوريوس\n2️⃣ دراسة الماجستير\n3️⃣ التحضير لامتحان IMAT (للطب)',
    validate: (text) => isValidOption(text, 3),
    error: '⚠️ يرجى كتابة رقم الاختيار (1 أو 2 أو 3).'
  },
  {
    key: 'academic_year',
    text: '🎒 *في أي سنة دراسية أنت الآن؟*\n(مثال: أولى، ثانية، رابعة، أو متخرج)',
    validate: (text) => String(text).trim().length >= 3,
    error: '⚠️ يرجى كتابة السنة الدراسية بوضوح.'
  },
  {
    key: 'gpa',
    text: '📊 *ما هو تقديرك التراكمي أو الـ GPA تقريباً؟*\n\n1️⃣ من 3.5 إلى 4.0\n2️⃣ من 3.0 إلى 3.4\n3️⃣ من 2.5 إلى 2.9\n4️⃣ أقل من 2.5',
    validate: (text) => isValidOption(text, 4),
    error: '⚠️ يرجى كتابة رقم الاختيار من 1 إلى 4.'
  },
  {
    key: 'target_field',
    text: '💡 *ما هو المجال الذي تطمح لدراسته في إيطاليا؟*\n(مثال: هندسة، طب، أعمال، الخ)',
    validate: (text) => String(text).trim().length >= 3,
    error: '⚠️ يرجى كتابة المجال بوضوح.'
  },
  {
    key: 'chosen_major',
    text: '🤔 *هل استقريت على تخصص دقيق معين أم تحتاج لمساعدة مستشارينا؟*\n\n1️⃣ نعم، استقريت على تخصص.\n2️⃣ أحتاج إلى مساعدة وتوجيه.',
    validate: (text) => isValidOption(text, 2),
    error: '⚠️ يرجى كتابة رقم الاختيار (1 أو 2).'
  },
  {
    key: 'current_situation',
    text: '✍️ *يرجى شرح وضعك الحالي باختصار، وما هي التحديات التي تواجهك؟*',
    validate: (text) => String(text).trim().length >= 5,
    error: '⚠️ يرجى كتابة تفاصيل أكثر لنتمكن من توجيهك بشكل دقيق.'
  },
  {
    key: 'inquiries',
    text: '❓ *أخيراً.. هل لديك أي استفسار محدد تود طرحه على المستشار الأكاديمي؟*',
    validate: () => true,
    error: ''
  }
];

async function sendDataToSheets(data) {
  try {
    const payload = {
      type: 'bot',
      source: 'WhatsApp Bot',
      page: 'whatsapp-bot',
      rawPayload: data,
      name: data.name || '',
      age: data.age || '',
      phone: data.phone || '',
      governorate: data.governorate || '',
      faculty: data.faculty || '',
      language_cert: data.language_cert || '',
      study_language: data.study_language || '',
      goal: data.goal || '',
      academic_year: data.academic_year || '',
      gpa: data.gpa || '',
      target_field: data.target_field || '',
      chosen_major: data.chosen_major || '',
      current_situation: data.current_situation || '',
      inquiries: data.inquiries || ''
    };

    await axios.post(GOOGLE_SHEET_WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 25000
    });

    console.log(`📊 تم تصدير بيانات العميل (${data.name || 'غير معروف'}) إلى Google Sheets بنجاح.`);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تصدير البيانات إلى Google Sheets:', error.response?.data || error.message);
  }
}

async function sendTypingAndMessage(sock, sender, messageText) {
  try {
    await sock.presenceSubscribe(sender);
    await sock.sendPresenceUpdate('composing', sender);
    await new Promise(resolve => setTimeout(resolve, 1200));
    await sock.sendPresenceUpdate('paused', sender);
    await sock.sendMessage(sender, { text: messageText });
  } catch (error) {
    try {
      await sock.sendMessage(sender, { text: messageText });
    } catch (secondError) {
      console.error('❌ فشل في إرسال الرسالة:', secondError.message);
    }
  }
}

async function connectToWhatsApp() {
  console.log('📍 جاري بدأ تشغيل البوت الاحترافي...');

  try {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('road_to_italy_session');

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['Ubuntu', 'Chrome', '20.0.04'],
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 10000
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n✅ QR Code ready. Scan it with WhatsApp.');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const errorMsg = lastDisconnect?.error?.message || lastDisconnect?.error;
        console.log('\n❌ Connection closed. Reason:', errorMsg);

        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log('🔄 Reconnecting automatically...');
          setTimeout(connectToWhatsApp, 2000);
        }
      } else if (connection === 'open') {
        console.log('\n🚀 BOT IS ONLINE AND READY!\n');
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') continue;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) continue;

        const now = Date.now();

        if (messageTimestamps[sender] && (now - messageTimestamps[sender] < SPAM_WINDOW_MS)) {
          continue;
        }
        messageTimestamps[sender] = now;

        const userInput = String(text).trim();

        if (userInput === 'reset') {
          delete userSessions[sender];
          saveSessions();
          await sendTypingAndMessage(sock, sender, '🔄 تم إعادة ضبط المحادثة من جديد.');
          continue;
        }

        if (userSessions[sender]) {
          const session = userSessions[sender];
          const timeSinceLastActive = now - session.lastActive;

          if (session.status === 'completed' || session.status === 'handoff') {
            if (timeSinceLastActive < TIMEOUT_MS) {
              await sendTypingAndMessage(sock, sender, '✅ بياناتك مسجلة لدينا بالفعل وفريقنا يقوم بمراجعتها حالياً.\nسيقوم أحد مستشارينا بالتواصل معك في أقرب وقت ممكن. 👨‍💼');
              session.lastActive = now;
              saveSessions();
              continue;
            } else {
              delete userSessions[sender];
              saveSessions();
            }
          } else {
            if (timeSinceLastActive > TIMEOUT_MS) {
              delete userSessions[sender];
              saveSessions();
            } else {
              session.lastActive = now;
              saveSessions();
            }
          }
        }

        if (userInput === 'موظف' || userInput === 'دعم') {
          if (!userSessions[sender]) userSessions[sender] = { answers: {}, lastActive: now };
          userSessions[sender].status = 'handoff';
          userSessions[sender].lastActive = now;
          saveSessions();
          await sendTypingAndMessage(sock, sender, '🛑 تم إيقاف المساعد الآلي.\nسيقوم أحد مستشاري ROAD to ITALY بالرد عليك في أقرب وقت.');
          continue;
        }

        if (userSessions[sender]?.status === 'handoff' || userSessions[sender]?.status === 'completed') continue;

        if (!userSessions[sender]) {
          userSessions[sender] = {
            step: 0,
            answers: {},
            status: 'active',
            isConfirming: false,
            failCount: 0,
            lastActive: now
          };
          saveSessions();
          await sendTypingAndMessage(sock, sender, questions[0].text);
          continue;
        }

        const session = userSessions[sender];

        if (session.isConfirming) {
          if (userInput === '1') {
            await sendTypingAndMessage(sock, sender, '🎉 تم تأكيد واستلام بياناتك بنجاح!\n\nفريقنا يقوم الآن بمراجعة ملفك وسنتواصل معك قريباً جداً لبدء رحلتك. ✈️🇮🇹');
            sendDataToSheets(session.answers);
            session.status = 'completed';
            saveSessions();
          } else if (userInput === '2') {
            session.step = 0;
            session.answers = {};
            session.isConfirming = false;
            session.failCount = 0;
            saveSessions();
            await sendTypingAndMessage(sock, sender, 'لا توجد مشكلة، دعنا نقوم بإدخال البيانات بشكل صحيح.\n\n' + questions[0].text);
          } else {
            await sendTypingAndMessage(sock, sender, 'عفواً، يرجى اختيار:\n1️⃣ لتأكيد البيانات وإرسالها.\n2️⃣ لإعادة الإدخال والتعديل.');
          }
          continue;
        }

        const currentQuestion = questions[session.step];

        if (!currentQuestion.validate(userInput)) {
          session.failCount = (session.failCount || 0) + 1;
          saveSessions();

          if (session.failCount >= 3) {
            session.status = 'handoff';
            saveSessions();
            await sendTypingAndMessage(sock, sender, '⚠️ يبدو أنك تواجه صعوبة في إدخال البيانات المطلوبة.\n\n🛑 تم تحويلك مباشرة إلى أحد مستشارينا البشريين لمساعدتك في إكمال التسجيل بنجاح. انتظرنا قليلاً!');
            continue;
          }

          await sendTypingAndMessage(sock, sender, currentQuestion.error);
          continue;
        }

        session.failCount = 0;

        let finalAnswer = userInput;

        if (currentQuestion.key === 'language_cert') {
          finalAnswer = userInput === '1' ? 'يمتلك شهادة' : userInput === '2' ? 'لا يمتلك' : 'يستعد للامتحان';
        }

        if (currentQuestion.key === 'study_language') {
          finalAnswer = userInput === '1' ? 'عربي' : 'إنجليزي';
        }

        if (currentQuestion.key === 'goal') {
          finalAnswer = userInput === '1' ? 'بكالوريوس' : userInput === '2' ? 'ماجستير' : 'IMAT';
        }

        if (currentQuestion.key === 'gpa') {
          finalAnswer =
            userInput === '1' ? '3.5 - 4.0' :
            userInput === '2' ? '3.0 - 3.4' :
            userInput === '3' ? '2.5 - 2.9' :
            'أقل من 2.5';
        }

        if (currentQuestion.key === 'chosen_major') {
          finalAnswer = userInput === '1' ? 'استقر على تخصص' : 'يحتاج مساعدة';
        }

        session.answers[currentQuestion.key] = finalAnswer;
        session.step += 1;
        saveSessions();

        if (session.step < questions.length) {
          let nextText = questions[session.step].text;
          if (session.step === 1) {
            const firstName = String(session.answers.name || '').trim();
            nextText = nextText.replace('[NAME]', firstName);
          }

          await sendTypingAndMessage(sock, sender, nextText);
        } else {
          session.isConfirming = true;
          saveSessions();

          const summary =
            '📋 *مراجعة البيانات*\nيرجى التأكد من صحة بياناتك قبل الإرسال:\n\n' +
            `👤 الاسم: ${session.answers.name}\n` +
            `🎂 السن: ${session.answers.age}\n` +
            `📱 الموبايل: ${session.answers.phone}\n` +
            `🌍 المحافظة: ${session.answers.governorate}\n` +
            `🎯 الهدف: ${session.answers.goal}\n\n` +
            '*هل هذه البيانات صحيحة؟*\n\n' +
            '1️⃣ نعم، تأكيد وإرسال ✅\n' +
            '2️⃣ لا، إعادة إدخال البيانات 🔄';

          await sendTypingAndMessage(sock, sender, summary);
        }
      }
    });
  } catch (error) {
    console.error('🚨 [Main function error]:', error);
  }
}

connectToWhatsApp();