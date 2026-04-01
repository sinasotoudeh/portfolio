// A:\NEXT\Development\Projects\nonato\src\config\capabilities.config.ts

/**
 * پیکربندی متمرکز برای کامپوننت Capabilities Section
 * این فایل به ما اجازه می‌دهد تا تمام پارامترهای کلیدی انیمیشن و ظاهر را
 * از یک مکان مدیریت کنیم و از "اعداد جادویی" در کد جلوگیری شود.
 */
// ✅ FIX: افزودن کلمه کلیدی 'export' برای تبدیل فایل به یک ماژول
export const CAPABILITIES_CONFIG = {
    // پارامترهای استوانه سه‌بعدی
    CYLINDER_RADIUS: 11.5,
    CAMERA_Z_POSITION: 45,
    CAMERA_FOV: 40,

    // پارامترهای کارت
    CARD_WIDTH_PX: 290,
    CARD_HEIGHT_PX: 400,
    CARD_DISTANCE_FACTOR: 18,

    // پارامترهای انیمیشن اسکرول
    SCROLL_SPRING: {
        damping: 25,
        stiffness: 120,
        mass: 0.5,
    },

    // پارامترهای اسکرول‌بار سفارشی
    SCROLLBAR_THUMB_WIDTH_REM: 4, // 64px
};
