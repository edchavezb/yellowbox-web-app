import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from './Friends.module.css';
import { Box, Stack } from '@chakra-ui/react';
import UserFriendList from 'components/common/UserFriendList/UserFriendList';
import SearchInput from 'components/styled/SearchInput/SearchInput';
import useDebounce from 'core/hooks/useDebounce';
import { useHistory, useLocation } from 'react-router-dom';
import PopperMenu from 'components/menus/popper/PopperMenu';
import { useEffect, useRef, useState } from 'react';
import { searchUsersApi } from 'core/api/users';
import { YellowboxUser } from 'core/types/interfaces';
import UserSearchResults from 'components/menus/popper/UserSearchResults/UserSearchResults';

const Friends = () => {
  const history = useHistory();
  const location = useLocation();
  const friendList = useAppSelector(state => state.userData.authenticatedUser.followedUsers);
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get('search') || '';
  const inputRef = useRef(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<YellowboxUser[]>([]);

  const debouncedSearch = useDebounce(
    (searchQuery: string) => {
      console.log('searching for', searchQuery);
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      history.push(`/account/friends?search=${encodedQuery}`);
    },
    500
  );

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() !== '') {
        setIsResultsLoading(true);
        setIsResultsOpen(true);
        try {
          const { users } = await searchUsersApi(search);
          setSearchResults(users);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setIsResultsLoading(false);
        }
      } else {
        setIsResultsOpen(false);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [search]);

  return (
    <Stack className={styles.container} spacing={8}>
      <Box ref={inputRef}>
        <SearchInput
          placeholder={'Find users to follow'}
          defaultValue={search}
          onChange={value => debouncedSearch(value)}
        />
        <PopperMenu referenceRef={inputRef} placement="bottom-start" isOpen={isResultsOpen} setIsOpen={setIsResultsOpen}>
          <UserSearchResults users={searchResults} isLoading={isResultsLoading} />
        </PopperMenu>
      </Box>
      {friendList && friendList.length === 0 && <p>You are not following anyone yet.</p>}
      {friendList && friendList.length > 0 && <UserFriendList friendList={friendList || []} />}
    </Stack>
  );
};

export default Friends;