import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setFilter, setSort } from '../features/users/usersSlice';
import UserItem from './UserItem';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const hasMore = useSelector((state) => state.users.hasMore);
  const filters = useSelector((state) => state.users.filters);
  const sortConfig = useSelector((state) => state.users.sortConfig);

  const [page, setPage] = useState(0);

  const loadMoreUsers = useCallback(() => {
    if (status === 'loading' || !hasMore) return;
    dispatch(fetchUsers({ limit: 20, skip:page *10 }));
    setPage(page + 1);
  }, [dispatch, status, hasMore, page]);

  useEffect(() => {
    loadMoreUsers();
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      loadMoreUsers();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    dispatch(setSort({ key, direction }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key === null) {
      return 0;
    }
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredUsers = sortedUsers.filter(user => {
    if (filters.gender && user.gender !== filters.gender) {
      return false;
    }
    if (filters.country && user.address.country !== filters.country) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="mr-2">Gender:</label>
        <select
          className="mr-4"
          value={filters.gender}
          onChange={(e) => dispatch(setFilter({ gender: e.target.value }))}
        >
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label className="mr-2">Country:</label>
        <input
          className="mr-4"
          type="text"
          value={filters.country}
          onChange={(e) => dispatch(setFilter({ country: e.target.value }))}
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th rowSpan="2" className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('id')}>ID</th>
            <th rowSpan="2" className="border px-4 py-2">Image</th>
            <th rowSpan="2" className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('firstName')}>Name</th>
            <th colSpan="2" className="border px-4 py-2">Demography</th>
            <th rowSpan="2" className="border px-4 py-2">Country</th>
            <th rowSpan="2" className="border px-4 py-2">Designation</th>
          </tr>
          <tr>
            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('age')}>Age</th>
            <th className="border px-4 py-2">Gender</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <UserItem key={user.id} user={user} />
          ))}
        </tbody>
      </table>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserList;
