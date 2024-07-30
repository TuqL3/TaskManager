import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { BsChevronExpand } from 'react-icons/bs';
import { MdCheck } from 'react-icons/md';
import newRequest from '../../newRequest/newRequest';
const UserList = ({ setTeam, team }) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();

  useEffect(() => {
    const getData = async () => {
      const res = await newRequest.get('/user/get-team');
      const filteredData = res.data.map((user) => {
        const { isActive, role, ...rest } = user;
        return rest;
      });
      setData(filteredData);
    };
    getData();
  }, []);

  const handleSelect = (users) => {
    setSelected(users);
    setTeam(users);
  }

  return (
    <div>
      <p className="text-gray-700">Assign Task To: </p>
      <Listbox
        value={selected}
        onChange={handleSelect}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full h-[45px] cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
            <span className="block truncate">
              {selected?.map((user) => user?.name).join(', ')}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data?.map((user, index) => (
                <Listbox.Option key={user._id} value={user} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={`relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      {user.name}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
