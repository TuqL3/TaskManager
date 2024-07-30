import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { Dialog } from '@headlessui/react';
import Textbox from '../Textbox';
import { useForm } from 'react-hook-form';
import UserList from './UserList';
import SelectList from '../SelectList';
import Button from '../Button';
import newRequest from '../../newRequest/newRequest';
import { BiImages } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';

const LISTS = ['TODO', 'IN PROGRESS', 'COMPLETED'];
const PRIORITY = ['HIGH', 'MEDIUM', 'NORMAL', 'LOW'];

const AddTask = ({ open, setOpen, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      stage: task?.stage?.toUpperCase() || LISTS[0],
      priority: task?.priority?.toUpperCase() || PRIORITY[0],
      title: task?.title || '',
      date: task?.createdAt
        ? new Date(task.createdAt).toISOString().split('T')[0]
        : '',
    },
  });

  const [team, setTeam] = useState([]);
  const [assets, setAssets] = useState(task?.assets || null);
  const [uploading, setUploading] = useState(false);

  const stage = watch('stage');
  const priority = watch('priority');

  const submitHandler = async (data) => {
    await newRequest.put(`/task/update/${task._id}`, {
      title: data.title,
      stage: data.stage,
      priority: data.priority,
      date: data.date,
      team: team,
      assets: assets,
    });
  };

  const handleSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const images = new FormData();
    for (const file of selectedFiles) {
      images.append('images', file);
    }

    try {
      const response = await newRequest.post('/task/upload', images, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);

      const newUrls = response.data.data.map((res) => res);

      setAssets((prevAssets) => {
        const combinedAssets = [...prevAssets, ...newUrls];
        return combinedAssets.length <= 3
          ? combinedAssets
          : combinedAssets.slice(0, 3);
      });
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleDeleteAssets = (index) => {
    setAssets((prevAssets) => {
      const updatedAssets = [...prevAssets];
      updatedAssets.splice(index, 1);
      return updatedAssets;
    });
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? 'UPDATE TASK' : 'ADD TASK'}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register('title', { required: 'Title is required' })}
              error={errors.title ? errors.title.message : ''}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={(value) => setValue('stage', value)}
                register={register('stage')}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register('date', {
                    required: 'Date is required!',
                  })}
                  error={errors.date ? errors.date.message : ''}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={(value) => setValue('priority', value)}
                register={register('priority')}
              />

              <div className="w-full flex items-center flex-col justify-center mt-4">
                <div className="flex gap-4 overflow-x-auto max-w-full p-2">
                  {assets && assets.length !== 0
                    ? assets.map((a, i) => {
                        return (
                          <div key={i} className="relative">
                            <img
                              className="w-14 h-14 rounded-lg object-cover shadow-md hover:shadow-lg-hover"
                              src={a}
                              alt=""
                            />
                            <span
                              onClick={() => handleDeleteAssets(i)}
                              className="p-2 cursor-pointer flex items-center justify-center absolute opacity-0 text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:opacity-100"
                            >
                              <FaTimes />
                            </span>
                          </div>
                        );
                      })
                    : ''}
                </div>
                <div>
                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                    htmlFor="imgUpload"
                  >
                    <input
                      type="file"
                      className="hidden"
                      id="imgUpload"
                      onChange={handleSelect}
                      accept=".jpg, .png, .jpeg"
                      multiple={true}
                    />
                    <BiImages />
                    <span>Add Assets</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading assets
                </span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                />
              )}

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
