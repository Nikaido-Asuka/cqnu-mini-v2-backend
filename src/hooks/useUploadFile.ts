import { ref } from "vue";
import { message } from "ant-design-vue";
import { getBase64 } from "@/utils/utils";
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';

export function useUploadFile(){
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>('');

    const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            loading.value = true;
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (base64Url: string) => {
                imageUrl.value = base64Url;
                loading.value = false;
            });
        }
        if (info.file.status === 'error') {
            loading.value = false;
            message.error('Upload error');
        }
    };

    return {
        loading,
        imageUrl,
        handleChange,
    }
}