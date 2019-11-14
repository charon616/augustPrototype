AFRAME.registerComponent('show-map', {
    schema: {
        name: {
            type: 'string'
        }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'
        object3D.visible = false

        const showImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            button.style.display = 'block'
            object3D.visible = true
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    }
})