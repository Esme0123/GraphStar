const particlesConfig = {
    particles: {
        number: {
            value: 20,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#00F9A0", "#6A4C93", "#FFB732"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.5,
            random: true
        },
        size: {
            value: 150, 
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 50,
                sync: false
            }
        },
        move: {
            enable: true,
            speed: 1, 
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: false
            },
            onclick: {
                enable: false
            }
        }
    },
    retina_detect: true,
    background: {
        color: "transparent" 
    },
    fullScreen: {
        enable: true,
        zIndex: 1
    }
};

export default particlesConfig;