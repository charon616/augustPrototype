AFRAME.registerComponent('show-work', {
    schema: {
        name: {
            type: 'string'
        }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        const arrow = document.getElementById('arrow')
        button.style.display = 'none'
        object3D.visible = false
        arrow.object3D.visible = false

        // const workplane = document.getElementById('work-plane')
        // const work_children = workplane.children;

        const showImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            arrow.object3D.position.copy(detail.position)
            arrow.object3D.quaternion.copy(detail.rotation)

            button.style.display = 'block'
            object3D.visible = true
            arrow.objecrt3D.visible = true

            // for (let i = 0; i < work_children.length; i++) {
            //     work_children.item(i).classList.add('cantap')
            // }

        }
        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    }
})