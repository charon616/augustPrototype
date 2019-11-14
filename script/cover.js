AFRAME.registerComponent('link-with-newwindow', {
    schema: {
        href: { type: 'string', default: '' }
    },
    init: function () {
        this.el.addEventListener('click', (e) => {
            setTimeout(() => {
                if (window.open(this.data.href)) {
                } else {
                    window.location.href = this.data.href;
                };
            }, 300);
        })
    }
})

AFRAME.registerComponent('close-button', {
    init: function () {
        const targetObj1 = document.getElementById('cover-scene')
        const targetObj2 = document.getElementById('venue')
        const targetObj3 = document.getElementById('works')
        const closeButton = document.getElementById('closebutton')

        const snsbutton = document.getElementById("snsbutton");
        let cover_children = snsbutton.children;

        const workplane = document.getElementById('work-plane')
        const work_children = workplane.children;

        const logo = document.getElementById("logo-set");
        closeButton.onclick = () => {
            targetObj1.object3D.visible = false
            targetObj2.object3D.visible = false
            targetObj3.object3D.visible = false
            closeButton.style.display = 'none'
            logo.removeAttribute('mixin');

            for (let i = 0; i < cover_children.length; i++) {
                cover_children.item(i).classList.remove('cantap')
            }
            for (let i = 0; i < work_children.length; i++) {
                work_children.item(i).classList.remove('cantap')
            }

        }

    }
})

AFRAME.registerComponent('shadow-material', {
    init: function () {
        this.material = new THREE.ShadowMaterial()
        this.el.getOrCreateObject3D('mesh').material = this.material
        this.material.opacity = 0.3
    }
})

AFRAME.registerComponent('show-caption', {
    schema: {
        num: { type: 'int' },
        title: { type: 'string' },
        name: { type: 'string' },
        caption: { type: 'string' },
    },
    init: function () {
        const contents = document.getElementById('contents')
        const container = document.getElementById('container')
        const tapTarget = this.el

        let pageContent = `<h2>${this.data.title}</h2><h3>${this.data.name}</h3><p class="outer">${this.data.caption}</p>`

        tapTarget.addEventListener('click', e => {
            contents.innerHTML = pageContent
            container.classList.remove('collapsed')
        })
    }
})

AFRAME.registerComponent('my-xrextras-one-finger-rotate', {
    init: function () {
        this.handleEvent = this.handleEvent.bind(this)
        this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
        this.el.setAttribute('class', 'cantap')
    },
    remove: function () {
        this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
    },
    handleEvent: function (event) {
        this.el.object3D.rotation.y += event.detail.positionChange.x * 6
    }
})