export default async function UploadFileToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nh6nkw4a');

    return await fetch('https://api.cloudinary.com/v1_1/web-hcmus/image/upload', {
        method: 'POST',
        body: formData
    }).then(res => res.json())
        .catch(err => console.log(err));
}