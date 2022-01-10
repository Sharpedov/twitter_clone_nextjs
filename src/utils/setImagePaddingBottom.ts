export const setImagePaddingBottom = (
	setImagePaddingBottom: (paddingBottom: number) => void,
	imageUrl: string
) => {
	const img = new Image();
	img.src = imageUrl;

	img.onload = () => {
		const height = img.height;
		const width = img.width;

		if (height > width && height - width >= 100)
			return setImagePaddingBottom(133.333);
		if ((width >= height && width - height < 100) || width - height <= 0)
			return setImagePaddingBottom(100);

		return setImagePaddingBottom(56.25);
	};
};
