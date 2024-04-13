import { gsap } from 'gsap';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

// Define the Nuxt plugin

export default defineNuxtPlugin(() => {
    return { provide: { gsap } };
});