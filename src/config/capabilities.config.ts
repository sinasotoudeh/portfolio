export const CAPABILITIES_CONFIG = {
    // شعاع کمتر شد تا در سمت چپ به خوبی جا بگیرد
    CYLINDER_RADIUS: 11,
    CAMERA_Z_POSITION: 35,
    CAMERA_FOV: 45,

    CARD_WIDTH_PX: 320,
    CARD_HEIGHT_PX: 420,
    // افزایش فاکتور فاصله برای جلوگیری از تاری و پیکسلی شدن
    CARD_DISTANCE_FACTOR: 15,

    SCROLL_SPRING: {
        damping: 30,
        stiffness: 100,
        mass: 0.8,
    },
};
