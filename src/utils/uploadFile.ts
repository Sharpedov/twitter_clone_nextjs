import axios from "axios";

interface UploadFileProps {
	file: File;
	setProgress?: (percentage: number) => void;
}

export async function uploadFile({ file, setProgress }: UploadFileProps) {
	const formData = new FormData();
	const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
	const key = "docs_upload_example_us_preset";
	formData.append("file", file);
	formData.append("upload_preset", key);

	try {
		const { data } = await axios.post(url, formData, {
			onUploadProgress: (progressEvent) => {
				let percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				setProgress && setProgress(percentCompleted);
			},
			headers: {
				"Content-Type": "text/plain",
				"X-Requested-With": "XMLHttpRequest",
			},
		});
		return [data.secure_url, null];
	} catch (err) {
		throw [null, err];
	}
}
