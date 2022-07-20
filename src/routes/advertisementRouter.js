import express from 'express';
import { AdvertisementModule } from '../module/AdvertisementModule.js';
import { storage, fileFilter } from '../middleware/file.js';
import multer from 'multer';
import { isAuthenticated } from '../middleware/passport.js';

export const router = express.Router();

const advertisementModule = new AdvertisementModule();

router.get('/', async (req, res) => {
  console.log(req);
  const advertisements = await advertisementModule.find().catch((err) => {
    res.json({ error: err });
  });
  console.log(advertisements);

  res.json(advertisements);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const advertisement = await advertisementModule.findById(id);
    console.log(advertisement);
    res.json(advertisement);
  } catch (e) {
    res.json({ error: e });
  }
});

router.post(
  '/',
  isAuthenticated,
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: 'images', maxCount: 5 },
  ]),
  async (err, req, res) => {
    if (err) {
      res.json({
        error: 'Ошибка',
        status: 'error',
      });
    }
    const data = req.body;
    data.user = req.user;

    console.log(`data ${data}`);

    if (req.files.images.length) {
      data.images = req.files.images.map((img) => img.filename);
    }

    const advertisement = await advertisementModule.create(data);

    console.log(advertisement);

    data.id = advertisement._id;
    data.user = { id: data.user.id, name: data.user.name };

    res.status(201);
    res.json({ data: data, status: 'ok' });
  }
);

router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  const advertisement = await advertisementModule.findById(req.params.id);
  if (req.user._id !== advertisement.user._id) {
    res.status(403).json({
      error: 'Нет прав на это действие',
      status: 'error',
    });
  }
  await advertisementModule
    .remove(id)
    .then(() => {
      res.status(200).json({ deleted: id });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
