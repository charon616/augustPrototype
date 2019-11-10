AFRAME.registerComponent('map-display', {
    schema: {
        title: { default: '' },
        artist: { default: '' },
    },
    init: function () {
        // Limit title to 20 characters
        const displayTitle = this.data.title.length > 20 ? `${this.data.title.substring(0, 17)}...` : this.data.title
        const text = displayTitle + '\n' + this.data.artist
        const textData = {
            align: 'left',
            width: 0.7,
            wrapCount: 22,
            value: text,
            color: 'white',
        }

        this.el.setAttribute('text', textData)

        // Instantiate a second text object behind the first to achieve an shadow effect
        const textShadowEl = document.createElement('a-entity')
        textData.color = 'black'
        textShadowEl.setAttribute('text', textData)
        textShadowEl.object3D.position.z = -0.01
        this.el.appendChild(textShadowEl)
    }
})

AFRAME.registerComponent('hello-world', {
    init: function () {
        console.log('Hello, World!');

        const worksphere = document.createElement('a-entity')
        worksphere.setAttribute('scale', '0.95 0.95 0.95')
        worksphere.setAttribute('color', 'red')
        this.el.appendChild(frameEl)
    }
});

AFRAME.registerComponent('show-detail', {
    schema: {
        imgid: { type: 'string', default: '' }
    },
    init: function () {
        this.el.addEventListener('mouseenter', event => {
            const newElement = document.createElement('a-plane')
            const pos = this.el.getAttribute('position')

            newElement.setAttribute('src', this.data.imgid)
            newElement.setAttribute('height', 1)
            newElement.setAttribute('width', 3)
            newElement.setAttribute('material', 'transparent: true;')
            newElement.setAttribute('shader', 'flat')
            newElement.setAttribute('look-at', '#camera')
            newElement.setAttribute('position', {
                x: pos.x,
                y: pos.y,
                z: pos.z
            })
            this.el.sceneEl.appendChild(newElement)
        })

        this.el.addEventListener('mouseleave', event => {
            var child = this.el.sceneEl.querySelector('a-plane')
            this.el.sceneEl.removeChild(child);
        })

    }
})


AFRAME.registerComponent('tap-place', {
    init: function () {
        const ground = document.getElementById('ground')
        ground.addEventListener('click', event => {
            // Create new entity for the new object
            const newElement = document.createElement('a-entity')

            // The raycaster gives a location of the touch in the scene
            const touchPoint = event.detail.intersection.point
            newElement.setAttribute('position', touchPoint)

            const randomYRotation = Math.random() * 360
            newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

            newElement.setAttribute('visible', 'false')
            newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

            newElement.setAttribute('gltf-model', '#treeModel')
            this.el.sceneEl.appendChild(newElement)

            newElement.addEventListener('model-loaded', () => {
                // Once the model is loaded, we are ready to show it popping in using an animation
                newElement.setAttribute('visible', 'true')
                newElement.setAttribute('animation', {
                    property: 'scale',
                    to: '0.01 0.01 0.01',
                    easing: 'easeOutElastic',
                    dur: 800,
                })
            })
        })
    }
})
