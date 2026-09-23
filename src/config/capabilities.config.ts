// The Capabilities cylinder's scene, in the three.js terms it was designed in. The CSS-3D stage
// (src/components/Capability/cylinder.ts) derives its perspective, radius and card scale from
// these, so the cylinder keeps the geometry the WebGL version rendered (D-1).
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
