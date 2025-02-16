import axios from "axios";

const telegramToken = process.env.REACT_APP_TELEGRAM_TOKEN;
const botApi = process.env.REACT_APP_TELEGRAM_API;
const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID as string;

export const sendBotMessage = async (text: string): Promise<void> => {
  try {
    const params = `chat_id=${encodeURIComponent(chatId)}&text=${encodeURIComponent(text)}`;
    await axios(`${botApi}${telegramToken}/sendMessage?${params}`);
  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error);
  }
};

export const sendBotPhoto = async (photoUrl: string): Promise<void> => {
  try {
    const params = `chat_id=${encodeURIComponent(chatId)}&photo=${encodeURIComponent(photoUrl)}`;
    await axios(`${botApi}${telegramToken}/sendPhoto?${params}`);
  } catch (error) {
    console.error("Ошибка при отправке фото:", error);
  }
};

export const resizeImage = (file: File, quality = 0.15, coef = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      img.src = event.target?.result as string; // Устанавливаем src для изображения

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const targetWidth = img.width * coef; // Уменьшаем до 30% от исходного размера
        const targetHeight = img.height * coef;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Рисуем уменьшенное изображение на canvas
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Получаем сжатое изображение с уменьшенным качеством
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};
