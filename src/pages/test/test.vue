<template>
    <div>
        <a-upload
            v-model:file-list="fileList"
            name="file"
            :show-upload-list="false"
            :custom-request="customRequest"
            :before-upload="beforeUpload"
            @change="handleChange"
        >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div class=" w-[200px] h-[100px] rounded-[8px] bg-[#efefef] flex flex-col justify-center items-center"  v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
            </div>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import type { UploadFile } from 'ant-design-vue';
import { openNotificationWithIcon } from '@/utils/notification';

// utils
import { beforeUpload } from '@/utils/utils'

// api
import { upLoadFile } from '@/api/upload'

// hooks
import { useUploadFile } from '@/hooks/useUploadFile'
const { loading, imageUrl, handleChange } = useUploadFile();



const fileList = ref<UploadFile[]>([]);
let fileUrlList = ref<string[]>([])

// Custom upload function
const customRequest = async (options) => {
    console.log(options);
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append('uploadFile', file as any);
    formData.append('bucket', 'cqminiv2-imgs');
    formData.append('objectName', 'note');

    try{
        let res = await upLoadFile(formData);
        console.log(res);
        console.log(imageUrl);
        if (res.data.code === "0") {
            fileUrlList.value.push(res.data.data)
            imageUrl.value = res.data.data;
            openNotificationWithIcon("success", "上传成功！", "文件上传成功！");
        }
    }catch(err) {
        message.error("上传失败!")
    }

};

</script>

