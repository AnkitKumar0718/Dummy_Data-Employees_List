import React from 'react';

const UserItem = ({ user }) => (
  <tr>
    <td className="border px-4 py-2">{user.id}</td>
    <td className="border px-4 py-2">
      <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-16 h-16 object-cover rounded-full" />
    </td>
    <td className="border px-4 py-2">{user.firstName} {user.lastName}</td>
    <td className="border px-4 py-2">{user.age}</td>
    <td className="border px-4 py-2">{user.gender}</td>
    <td className="border px-4 py-2">{user.address.country}</td>
    <td className="border px-4 py-2">{user.company.title}</td>
  </tr>
);

export default UserItem;
