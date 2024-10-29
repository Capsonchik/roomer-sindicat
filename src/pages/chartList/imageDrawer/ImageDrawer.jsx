import { Button, Drawer, IconButton, List } from "rsuite";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveGroupId, selectGroupsReports } from "../../../store/chartSlice/chart.selectors";
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import TrashIcon from '@rsuite/icons/Trash';

export const ImageDrawer = ({ open, onClose }) => {
  const activeGroupId = useSelector(selectActiveGroupId);
  const groups = useSelector(selectGroupsReports);
  const [activeGroup, setActiveGroup] = useState();
  const [images, setImages] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [updatedImages, setUpdatedImages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const fileInputRefs = useRef([]);

  useEffect(() => {
    const foundGroup = groups.find((group) => group.group_id === activeGroupId);
    if (foundGroup) {
      setActiveGroup(foundGroup);
      setImages(foundGroup.images || []);
      setAddedImages([]);
      setDeletedImages([]);
      setUpdatedImages([]);
    }
  }, [activeGroupId, groups, open]);

  // Функция для замены изображения
  const handleReplaceImage = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file);
      setImages((prevImages) =>
        prevImages.map((img, i) => {
          if (i === index) {
            const updatedImage = { ...img, file_url: newImageURL };

            const isAddedImage = addedImages.find(img => img.index === index);
            if (isAddedImage) {
              setAddedImages((prevAddedImages) =>
                prevAddedImages.map((addedImg) =>
                  addedImg.index === index ? { ...addedImg, file_url: newImageURL } : addedImg
                )
              );
            } else {
              setUpdatedImages((prevUpdated) => {
                const existingIndex = prevUpdated.findIndex((uImg) => uImg.index === index);
                if (existingIndex >= 0) {
                  return prevUpdated.map((uImg, i) => (i === existingIndex ? updatedImage : uImg));
                }
                return [...prevUpdated, { index, file_url: newImageURL }];
              });
            }

            return updatedImage;
          }
          return img;
        })
      );
      setEditIndex(null);
    }
  };

  // Функция для удаления изображения
  const handleDeleteImage = (index) => {
    const deletedImage = images[index];
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (!addedImages.find(img => img.index === index)) {
      setDeletedImages((prevDeletedImages) => [...prevDeletedImages, deletedImage]);
    }
    setAddedImages((prevAddedImages) => prevAddedImages.filter(img => img.index !== index));
    setUpdatedImages((prevUpdatedImages) => prevUpdatedImages.filter(img => img.index !== index));
  };

  // Функция для добавления нового изображения
  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file);
      const newImageIndex = images.length;
      setImages((prevImages) => [...prevImages, { file_url: newImageURL }]);
      setAddedImages((prevAddedImages) => [
        ...prevAddedImages,
        { index: newImageIndex, file_url: newImageURL, file } // сохраняем файл для отправки
      ]);
    }
  };

  const handleReplaceImageClick = (index) => {
    setEditIndex(index);
    fileInputRefs.current[index].click();
  };

  // Функция для сохранения изображений
  const handleSaveImages = async () => {
    try {
      for (const img of addedImages) {
        const formData = new FormData();
        formData.append('image', img.file); // предполагается, что сервер ожидает поле с именем 'image'
        // Вы можете добавить другие данные, если необходимо, например:
        // formData.append('groupId', activeGroupId);

        // Отправляем запрос
        await fetch('/api/upload', { // замените на ваш URL
          method: 'POST',
          body: formData,
        });
      }
      // После успешной отправки можно закрытьDrawer или очистить состояния
      onClose(); // Закрываем Drawer после сохранения
    } catch (error) {
      console.error('Ошибка при сохранении изображений:', error);
    }
  };

  return (
    <Drawer open={open} onClose={onClose} style={{ maxWidth: 700, width: '100%' }}>
      <Drawer.Body>
        <div>
          <List bordered hover>
            {images.map((image, index) => (
              <List.Item key={index} index={index} style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                <img
                  src={image.file_url}
                  alt={`Preview ${index}`}
                  style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                />
                <Button appearance="link" size="xs" onClick={() => handleReplaceImageClick(index)}>
                  Заменить
                </Button>
                <Button
                  appearance="link"
                  color="red"
                  size="xs"
                  onClick={() => handleDeleteImage(index)}
                  icon={<TrashIcon />}
                >
                  Удалить
                </Button>
                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(event) => handleReplaceImage(event, index)}
                />
              </List.Item>
            ))}
          </List>
          <input
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAddImage}
            ref={(el) => (fileInputRefs.current["add"] = el)}
          />
          <IconButton
            icon={<AddOutlineIcon />}
            appearance="primary"
            onClick={() => fileInputRefs.current["add"].click()}
          >
            Добавить изображение
          </IconButton>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>Добавленные изображения:</h4>
          <ul>
            {addedImages.map(({ index, file_url }) => (
              <li key={index}>
                Новое изображение #{index + 1}: <img src={file_url} alt={`Добавленное изображение ${index + 1}`} style={{ maxWidth: '50px', marginLeft: '10px' }} />
              </li>
            ))}
          </ul>
          <h4>Удаленные изображения:</h4>
          <ul>
            {deletedImages.map((img, index) => (
              <li key={index}>
                Удаленное изображение: <img src={img.file_url} alt={`Удаленное изображение ${index + 1}`} style={{ maxWidth: '50px', marginLeft: '10px' }} />
              </li>
            ))}
          </ul>
          <h4>Измененные изображения:</h4>
          <ul>
            {updatedImages.map((img, index) => (
              <li key={index}>
                Измененное изображение: <img src={img.file_url} alt={`Измененное изображение ${index + 1}`} style={{ maxWidth: '50px', marginLeft: '10px' }} />
              </li>
            ))}
          </ul>
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button appearance="primary" onClick={handleSaveImages}>
          Сохранить
        </Button>
        <Button onClick={onClose}>Закрыть</Button>
      </Drawer.Footer>
    </Drawer>
  );
};
