<template>
<div id="edit">
    <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    </quill-editor>
    <div class="footer">
        <span class="cancel" @click="cancel">取消</span>
        <span class="save" @click="save">保存</span>
    </div>
</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            content: '<h2>编辑通知</h2>',
            editorOption: {
                // some quill options
            }
        }
    },
    methods: {
        onEditorBlur(quill) {
            // console.log('editor blur!', quill)
        },
        onEditorFocus(quill) {
            // console.log('editor focus!', quill)
        },
        onEditorReady(quill) {
            // console.log('editor ready!', quill)
        },
        onEditorChange({
            quill,
            html,
            text
        }) {
            // console.log('editor change!', quill, html, text)
            this.content = html
        },
        save() {
            let temp_html = this.content;
            this.$router.push({
                name: "pipe_rushrepair_piperepair"
            });
        },
        cancel() {
            this.$router.push({
                name: "pipe_rushrepair_piperepair"
            });
        }
    }
}
</script>

<style lang="scss" scoped>
#edit {
    width: 100%;
    height: 100%;
    .footer {
        width: 100%;
        display: flex;
        justify-content: center;
        span {
            display: inline-block;
            padding: 10px 20px;
            background: #0b83ff;
            border-radius: 5px;
            margin-right: 20px;
            cursor: pointer;
            color: #fff;
            &.cancel {
                background: #ccccce;
            }
        }
    }
}
</style>
