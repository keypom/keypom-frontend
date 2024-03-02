import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Image as ChakraImage,
  HStack,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from '@chakra-ui/icons';

import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import {
  DROP_CLAIM_STATUS_OPTIONS,
  DROP_TYPE_OPTIONS,
  PAGE_SIZE_ITEMS,
  createMenuItems,
} from '@/features/all-drops/config/menuItems';

import { PAGE_SIZE_LIMIT } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';

// import myData from '../data/db.json';

// props validation
// Gallery.propTypes = {
//   isSecondary: PropTypes.bool,
// };

export default function Gallery() {
  // const [events, setEvents] = useState(allEvents);
  // const isSecondary = props.isSecondary || false;
  // const [sorted, setSorted] = useState({ sorted: 'date', reversed: false });

  // pagination
  const [hasPagination, setHasPagination] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isAllDropsLoading, setIsAllDropsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const [selectedFilters, setSelectedFilters] = useState<{
    // type: string;
    search: string;
    // status: string;
    pageSize: number;
  }>({
    // type: DROP_TYPE_OPTIONS.ANY,
    search: '',
    // status: DROP_CLAIM_STATUS_OPTIONS.ANY,
    pageSize: PAGE_SIZE_LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [numOwnedDrops, setNumOwnedDrops] = useState<number>(0);
  const [filteredDataItems, setFilteredDataItems] = useState<DataItem[]>([]);
  // const [wallet, setWallet] = useState({});

  const { selector, accountId } = useAuthWalletContext();

  const handlePageSizeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: parseInt(item.label),
    }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleNextPage = () => {
    setCurPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurPage((prev) => prev - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        search: searchTerm,
      }));
    }
  };

  const handleFiltering = async (drops) => {
    // Apply the selected filters
    // if (selectedFilters.type !== DROP_TYPE_OPTIONS.ANY) {
    //   drops = drops.filter(
    //     (drop) =>
    //       keypomInstance.getDropType(drop).toLowerCase() === selectedFilters.type.toLowerCase(),
    //   );
    // }

    // if (selectedFilters.status !== DROP_CLAIM_STATUS_OPTIONS.ANY) {
    //   // Convert each drop to a promise that resolves to either the drop or null
    //   const dropsPromises = drops.map(async (drop) => {
    //     const keysLeft = await keypomInstance.getAvailableKeys(drop.drop_id);
    //     const isFullyClaimed = keysLeft === 0;
    //     const isPartiallyClaimed = keysLeft > 0 && keysLeft < drop.next_key_id;
    //     const isUnclaimed = keysLeft === drop.next_key_id;

    //     if (
    //       (isFullyClaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.FULLY) ||
    //       (isPartiallyClaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.PARTIALLY) ||
    //       (isUnclaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.UNCLAIMED)
    //     ) {
    //       return drop;
    //     }
    //     return null;
    //   });

    //   // Wait for all promises to resolve, then filter out the nulls
    //   const resolvedDrops = await Promise.all(dropsPromises);
    //   drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
    // }

    if (selectedFilters.search.trim() !== '') {
      drops = drops.filter((drop) => {
        const { dropName } = keypomInstance.getDropMetadata(drop.metadata);
        return dropName.toLowerCase().includes(selectedFilters.search.toLowerCase());
      });
    }

    return drops;
  };

  const handleGetAllDrops = useCallback(async () => {
    setIsAllDropsLoading(true);

    const drops = await keypomInstance.getAllDrops({
      accountId: accountId!,
    });

    const filteredDrops = await handleFiltering(drops);
    const dropData = await Promise.all(
      filteredDrops.map(async (drop) => await keypomInstance.getDropData({ drop })),
    );
    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(filteredDrops.length / selectedFilters.pageSize);
    setHasPagination(totalPages > 1);
    setNumPages(totalPages);

    setCurPage(0);
    setIsAllDropsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const handleGetInitialDrops = useCallback(async () => {
    setIsLoading(true);

    // First get the total supply of drops so we know when to stop fetching
    const totalSupply = await keypomInstance.getDropSupplyForOwner({ accountId: accountId! });
    // setNumOwnedDrops(totalSupply);

    // Loop until we have enough filtered drops to fill the page size
    let dropsFetched = 0;
    let filteredDrops: ProtocolReturnedDrop[] = [];
    while (dropsFetched < totalSupply && filteredDrops.length < selectedFilters.pageSize) {
      const drops = await keypomInstance.getPaginatedDrops({
        accountId: accountId!,
        start: dropsFetched,
        limit: selectedFilters.pageSize,
      });
      dropsFetched += drops.length;

      const curFiltered = await handleFiltering(drops);
      filteredDrops = filteredDrops.concat(curFiltered);
    }

    // Now, map over the filtered drops and set the data
    const dropData = await Promise.all(
      filteredDrops.map(async (drop) => await keypomInstance.getDropData({ drop })),
    );
    setFilteredDataItems(dropData);
    setCurPage(0);
    setIsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  // useEffect(() => {
  //   async function fetchWallet() {
  //     if (!selector) return;
  //     try {
  //       const wallet = await selector.wallet();
  //       setWallet(wallet);
  //     } catch (error) {
  //       console.error('Error fetching wallet:', error);
  //       // Handle the error appropriately
  //     }
  //   }

  //   fetchWallet();
  // }, [selector]);

  useEffect(() => {
    if (!accountId) return;

    // First get enough data with the current filters to fill the page size
    handleGetInitialDrops();
  }, [accountId]);

  useEffect(() => {
    if (!accountId) return;

    // In parallel, fetch all the drops
    handleGetAllDrops();
  }, [accountId, selectedFilters]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const getGalleryGridRows = () => {
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];
    console.log('currpage: ' + curPage);
    console.log('selectedFilters.pageSize: ' + selectedFilters.pageSize);
    return filteredDataItems.slice(
      curPage * selectedFilters.pageSize,
      (curPage + 1) * selectedFilters.pageSize,
    );
  };

  // search value
  // const [searchPhrase, setSearchPhrase] = useState('');
  // const handleChange = (changeEvent) => {
  //   setSearchPhrase(changeEvent.target.value);
  //   const matchedEvents = allEvents.filter((event) => {
  //     return event.title.toLowerCase().includes(changeEvent.target.value.toLowerCase());
  //   });
  //   setEvents(matchedEvents);
  // };

  // const sortByTitle = () => {
  //   let tempreversed = sorted.reversed;
  //   if (sorted.sorted === 'title') {
  //     setSorted({ sorted: 'title', reversed: !sorted.reversed });
  //     tempreversed = !tempreversed;
  //   } else {
  //     setSorted({ sorted: 'title', reversed: false });
  //     tempreversed = false;
  //   }
  //   const eventsCopy = [...events];
  //   eventsCopy.sort((eventA, eventB) => {
  //     if (tempreversed) {
  //       return eventA.title.localeCompare(eventB.title);
  //     }
  //     return eventB.title.localeCompare(eventA.title);
  //   });
  //   setEvents(eventsCopy);
  // };

  // const sortByDate = () => {
  //   let tempreversed = sorted.reversed;
  //   if (sorted.sorted === 'date') {
  //     setSorted({ sorted: 'date', reversed: !sorted.reversed });
  //     tempreversed = !tempreversed;
  //   } else {
  //     setSorted({ sorted: 'date', reversed: false });
  //     tempreversed = false;
  //   }
  //   const eventsCopy = [...events];
  //   console.log(sorted.reversed);
  //   eventsCopy.sort((eventA, eventB) => {
  //     if (tempreversed) {
  //       return eventA.date.localeCompare(eventB.date);
  //     }
  //     return eventB.date.localeCompare(eventA.date);
  //   });

  //   console.log(eventsCopy[1]);
  //   setEvents(eventsCopy);
  // };

  // const RenderArrow = () => {
  //   if (sorted.reversed) {
  //     return <ArrowUpIcon />;
  //   }
  //   return <ArrowDownIcon />;
  // };

  return (
    <Box p="10">
      <ChakraImage
        alt={}
        height="300"
        objectFit="cover"
        src="https://via.placeholder.com/300"
        width="100%"
      />
      <Divider bg="black" my="5" />

      <HStack alignItems="center" display="flex" spacing="auto">
        <HStack align="stretch" justify="space-between" w="full">
          <InputGroup width="300px">
            <InputLeftElement height="full" pointerEvents="none">
              <Icon as={SearchIcon} color="gray.400" />
            </InputLeftElement>
            <Input
              backgroundColor="white"
              border="2px solid"
              borderColor="gray.200"
              color="gray.400"
              fontSize="md"
              fontWeight="medium"
              h="52px"
              height="full"
              placeholder="Search..."
              px="6"
              sx={{
                '::placeholder': {
                  color: 'gray.400', // Placeholder text color
                },
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
          <HStack>
            <Button
              py="6"
              variant="secondary"
              // onClick={sortByDate}
            >
              {/* {sorted.sorted === 'date' ? RenderArrow() : null} */}
              Date
            </Button>
            <Button
              py="6"
              variant="secondary"
              // onClick={sortByTitle}
            >
              {/* {sorted.sorted === 'title' ? RenderArrow() : null} */}
              Title
            </Button>
          </HStack>
        </HStack>
      </HStack>

      <Divider bg="black" my="5" />
      <GalleryGrid data={getGalleryGridRows()} loading={isLoading} />
      <DropManagerPagination
        type={'Events'}
        curPage={curPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        hasPagination={hasPagination}
        isLoading={isAllDropsLoading}
        numPages={numPages}
        pageSizeMenuItems={pageSizeMenuItems}
        rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
        onClickRowsSelect={() => (popoverClicked.current += 1)}
      />
    </Box>
  );
}
