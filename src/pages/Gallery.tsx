import {
  Box,
  Heading,
  Input,
  Image as ChakraImage,
  HStack,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Menu,
  MenuList,
  Skeleton,
  Flex,
  Hide,
  VStack,
  Show,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import '../features/gallery/components/cssoverrides.css';
import { type Moment } from 'moment';
import { type ProtocolReturnedDrop } from 'keypom-js';

import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import {
  GALLERY_PRICE_ITEMS,
  GALLERY_PAGE_SIZE_ITEMS,
  SORT_MENU_ITEMS,
  createMenuItems,
} from '@/features/all-drops/config/menuItems';
import keypomInstance from '@/lib/keypom';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';
import { FilterOptionsMobileButton } from '@/features/all-drops/components/FilterOptionsMobileButton';
import { MobileDrawerMenu } from '@/features/all-drops/components/MobileDrawerMenu';
import { truncateAddress } from '@/utils/truncateAddress';

// import myData from '../data/db.json';

// props validation
// Gallery.propTypes = {
//   isSecondary: PropTypes.bool,
// };

export default function Gallery() {
  // const isSecondary = props.isSecondary || false;
  // pagination
  const [hasPagination, setHasPagination] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isAllDropsLoading, setIsAllDropsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // date range picker
  const [focusedInput, setFocusedInput] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState<{
    // type: string;
    search: string;
    pageSize: number;
    price: string;
    startDate: Moment | null;
    endDate: Moment | null;
    sort: string;
    // reversed: boolean;
  }>({
    // type: DROP_TYPE_OPTIONS.ANY,
    search: '',
    pageSize: parseInt(GALLERY_PAGE_SIZE_ITEMS[0].label),
    price: GALLERY_PRICE_ITEMS[0].label,
    startDate: null,
    endDate: null,
    sort: 'Tickets ascending',
    // reversed: false,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [numOwnedDrops, setNumOwnedDrops] = useState<number>(0);
  const [filteredDataItems, setFilteredDataItems] = useState<DataItem[]>([]);
  // const [wallet, setWallet] = useState({});

  const [banner, setBanner] = useState('defaultbanner');

  const handleSortMenuSelect = (item) => {
    // if you select the same item, reverse the order
    // if (selectedFilters.sort === item.label) {
    //   setSelectedFilters((prevFilters) => ({
    //     ...prevFilters,
    //     reversed: !prevFilters.reversed,
    //   }));
    // } else {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      sort: item.label,
    }));
    // }
  };

  const handlePriceFilterSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      price: item.label,
    }));
  };

  const { accountId } = useAuthWalletContext();

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

  const handleFiltering = async (events) => {
    // Apply the selected filters

    let drops = events;

    if (selectedFilters.price !== GALLERY_PRICE_ITEMS[0].label) {
      console.log('test selectedFilters.price: ', selectedFilters.price);
      // Apply price filters
      const priceFilter = selectedFilters.price;
      // Convert each drop to a promise that resolves to either the drop or null
      console.log('test events: ', events);
      const dropsPromises = events.map((event) => {
        console.log('test event: ', event);
        let price = -1;
        for (const [key, value] of Object.entries(event.ticket_info)) {
          price = parseFloat(keypomInstance.yoctoToNear(value.price));
          console.log('test price: ', price);
        }
        if (price === -1) {
          return null;
        }
        if (priceFilter === GALLERY_PRICE_ITEMS[1].label) {
          if (price < 20) {
            return event;
          } else {
            return null;
          }
        } else if (priceFilter === GALLERY_PRICE_ITEMS[2].label) {
          if (price >= 20 && price < 50) {
            return event;
          } else {
            return null;
          }
        } else if (priceFilter === GALLERY_PRICE_ITEMS[3].label) {
          if (price >= 50 && price < 100) {
            return event;
          } else {
            return null;
          }
        } else if (priceFilter === GALLERY_PRICE_ITEMS[4].label) {
          if (price >= 100) {
            return event;
          } else {
            return null;
          }
        }
      });

      console.log('test dropsPromises: ', dropsPromises);

      const resolvedDrops = await Promise.all(dropsPromises);
      drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
      console.log('test drops: ', drops);
    }

    if (selectedFilters.search.trim() !== '') {
      // Apply search filter
      // Convert each drop to a promise that resolves to either the drop or null
      const dropsPromises = drops.map(async (drop) => {
        console.log('12edrop: ', drop);
        const data = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: drop.event_id,
        });
        console.log('12edata: ', data);
        if (data == undefined) return null;
        // const data = await keypomInstance.getDropData({ drop });
        // const { dropName } = keypomInstance.getDropMetadata(drop.metadata);

        const description = data.description;

        // console.log('dropName: ', dropName);
        // console.log('description: ', description);
        if (
          data.name.toLowerCase().includes(searchTerm) ||
          description.toLowerCase().includes(searchTerm)
        ) {
          return drop;
        } else return null;
      });

      const resolvedDrops = await Promise.all(dropsPromises);
      drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
    }

    // apply start and end date filters
    console.log('endDate: ', selectedFilters.endDate);
    console.log('startDate: ', selectedFilters.startDate);

    if (selectedFilters.startDate !== null) {
      // Convert each drop to a promise that resolves to either the drop or null
      const dropsPromises = drops.map(async (drop) => {
        console.log('12fdrop: ', drop);
        const data = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: drop.event_id,
        });
        if (data == undefined) return null;
        console.log('12fdata: ', data);
        console.log('12fdate: ', data.date.date);
        let dateString = data.date.date;
        // take start date, check if it is a string or object
        if (typeof data.date.date !== 'string') {
          dateString = data.date.date.from;
        }
        const date = new Date(dateString);
        console.log('12fdatee: ', date);
        if (date >= selectedFilters.startDate.toDate()) {
          return drop;
        } else return null;
      });

      const resolvedDrops = await Promise.all(dropsPromises);
      drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
    }

    if (selectedFilters.endDate !== null) {
      // Convert each drop to a promise that resolves to either the drop or null
      const dropsPromises = drops.map(async (drop) => {
        console.log('12edrop: ', drop);
        const data = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: drop.event_id,
        });
        if (data == undefined) return null;
        console.log('12edata: ', data);
        console.log('12edate: ', data.date.date);
        let dateString = data.date.date;
        // take start date, check if it is a string or object
        if (typeof data.date.date !== 'string') {
          dateString = data.date.date.from;
        }
        const date = new Date(dateString);
        console.log('12edatee: ', date);
        console.log('12edatee2: ', selectedFilters.endDate.toDate());
        console.log('12edatee3: ', date <= selectedFilters.endDate.toDate());
        if (date <= selectedFilters.endDate.toDate()) {
          return drop;
        } else return null;
      });

      const resolvedDrops = await Promise.all(dropsPromises);
      drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
    }

    // before returning drops, sort them if all drops are fetched
    if (!isAllDropsLoading) {
      // get data for each drop and pair it with the drop
      let dropData = await Promise.all(
        drops.map(async (drop) => {
          const data = await keypomInstance.getEventInfo({
            accountId: drop.funder_id,
            eventId: drop.event_id,
          });
          return ([drop, data]);
        }),
      );
      //filter out all null entries
      dropData = dropData.filter((drop) => drop[1] !== null && drop[1] !== undefined);
      console.log('before sortuing');
      console.log('12g:' dropData);
      // sort the drops based on the selected sort option
      // if (selectedFilters.sort === 'Date') {
      //   dropData = dropData.sort((a, b) => {
      //     if (selectedFilters.reversed) {
      //       return b[1].type.localeCompare(a[1].type);
      //     }
      //     return a[1].type.localeCompare(b[1].type);
      //   });
      // }
      // if (selectedFilters.sort === 'Price') {
      //   dropData = dropData.sort((a, b) => {
      //     if (selectedFilters.reversed) {
      //       return b[1].claimed.localeCompare(a[1].claimed);
      //     }
      //     return a[1].claimed.localeCompare(b[1].claimed);
      //   });
      // }
      if (selectedFilters.sort === 'Tickets ascending') {
        dropData = dropData.sort((a, b) => {
          return a[1].id.localeCompare(b[1].id);
        });
      }
      if (selectedFilters.sort === 'Tickets descending') {
        dropData = dropData.sort((a, b) => {
          return b[1].id.localeCompare(a[1].id);
        });
      }
      console.log('after sortuing');
      console.log(dropData);
      // extract the drops from the sorted array
      drops = dropData.map((drop) => drop[0]);
    }

    return drops;
  };

  const formatDate = (date) => {
    // Create an instance of Intl.DateTimeFormat for formatting
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', // Full month name.
      day: 'numeric', // Numeric day of the month.
      year: 'numeric', // Numeric full year.
      hour: 'numeric', // Numeric hour.
      minute: 'numeric', // Numeric minute.
      hour12: true, // Use 12-hour time.
    });
    return formatter.format(date);
  };

  const [numOwnedEvents, setNumOwnedEvents] = useState<number>(0);

  const handleGetAllEvents = useCallback(async () => {
    setIsAllDropsLoading(true);
    let eventListings = await keypomInstance.GetMarketListings({
      limit: 50,
      from_index: 0,
    });

    const numEvents = eventListings.length;
    setNumOwnedEvents(numEvents);

    eventListings = await handleFiltering(eventListings);

    const dropDataPromises = eventListings.map(async (event) => {
      // get metadata from drop.event_id and drop.funder_id
      const eventInfo = await keypomInstance.getEventInfo({
        accountId: event.funder_id,
        eventId: event.event_id,
      });

      let dateString = '';
      if (eventInfo?.date) {
        dateString =
          typeof eventInfo.date.date === 'string'
            ? eventInfo.date.date
            : `${eventInfo.date.date.from} to ${eventInfo.date.date.to}`;
      }

      if (event == undefined || eventInfo == undefined) {
        console.log('event or eventInfo is undefined');
        return null;
      }

      const numTickets = Object.keys(event.ticket_info).length;
      console.log('swef1: ', eventInfo.dateCreated);
      const dateCreated = formatDate(new Date(parseInt(eventInfo.dateCreated)));
      console.log('swef2: ', dateCreated);
      return {
        location: eventInfo.location,
        dateString,
        id: event.event_id,
        name: truncateAddress(eventInfo.name || 'Untitled', 'end', 48),
        media: eventInfo.artwork,
        dateCreated, // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        description: eventInfo.description,
        eventId: event.event_id,
        navurl: String(event.funder_id) + ':' + event.event_id,
      };
    });

    // Use Promise.all to wait for all promises to resolve
    let dropData = await Promise.all(dropDataPromises);
    console.log('just resolved', dropData);
    // filter out all null entries
    dropData = dropData.filter((drop) => drop !== null);
    console.log('just resolved2', dropData);

    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(dropDataPromises.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    console.log('just stopped loadgin for all', dropData);
    setIsAllDropsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const handleGetInitialDrops = useCallback(async () => {
    setIsLoading(true);
    // First get the total supply of drops so we know when to stop fetching
    const totalSupply = 1; // await keypomInstance.getDropSupplyForOwner({ accountId: accountId! });

    console.log('initialtotal', totalSupply);

    // Loop until we have enough filtered drops to fill the page size
    let dropsFetched = 0;
    let filteredDrops: ProtocolReturnedDrop[] = [];
    while (dropsFetched < totalSupply && filteredDrops.length < selectedFilters.pageSize) {
      const drops = await keypomInstance.GetMarketListings({
        limit: 50,
        from_index: dropsFetched,
      });

      dropsFetched += Number(drops.length);

      console.log(
        'All Event Drops: ',
        drops,
        'dropsFetched: ',
        dropsFetched,
        'totalSupply: ',
        totalSupply,
      );

      drops = drops.filter(async (drop) => {
        // get metadata from drop.event_id and drop.funder_id
        const meta = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: drop.event_id,
        });
        console.log('metadataaa: ', meta);
        // const meta: EventDropMetadata = JSON.parse(metadata);
        return meta !== undefined;
      });

      console.log('All Event Drops drops: ', drops);

      const curFiltered = await handleFiltering(drops);
      console.log('All Eventjust filtered: ', curFiltered);

      filteredDrops = filteredDrops.concat(curFiltered);
    }

    console.log('All Event boutta dropdata: ');

    // Now, map over the filtered drops and set the data
    let dropData = await Promise.all(
      filteredDrops.map(async (drop) => {
        return await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: drop.event_id,
        });
      }),
    );
    console.log('All Event dropdata: ', dropData);

    console.log('just resolved3', dropData);
    // filter out all null entries
    dropData = dropData.filter((drop) => drop !== null && drop !== undefined);
    console.log('just resolved4', dropData);

    setFilteredDataItems(dropData);
    setCurPage(0);
    setIsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  useEffect(() => {
    if (filteredDataItems.length == 0) return;
    const randomElement = filteredDataItems[Math.floor(Math.random() * filteredDataItems.length)];

    setBanner(randomElement.media);
  }, [filteredDataItems]);

  useEffect(() => {
    if (!accountId) return;

    // First get enough data with the current filters to fill the page size
    handleGetInitialDrops();
  }, [accountId]);

  useEffect(() => {
    if (!accountId) return;

    // In parallel, fetch all the events
    handleGetAllEvents();
  }, [accountId, selectedFilters]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: GALLERY_PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const sortOrderMenuItems = createMenuItems({
    menuItems: SORT_MENU_ITEMS,
    onClick: (item) => {
      handleSortMenuSelect(item);
    },
  });

  const priceMenuItems = createMenuItems({
    menuItems: GALLERY_PRICE_ITEMS,
    onClick: (item) => {
      handlePriceFilterSelect(item);
    },
  });

  const getGalleryGridRows = () => {
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];
    console.log('currpage: ' + curPage);
    console.log('selectedFilters.pageSize: ' + selectedFilters.pageSize);

    let gridData = filteredDataItems;
    //fix dates here and then pass them to the gallerygrid
    //turn these into nice bois
    //map over the filtered drops and clean the date
    gridData = gridData.map((drop) => {
      console.log('swefdrop: ', drop);
      let dateString = drop.dateString;
      if(drop.dateString == undefined) {
        dateString = drop.date.date;
        if(typeof drop.date.date !== 'string') {
          dateString = drop.date.date.from + ' to ' + drop.date.date.to;
        }
      }
      
      console.log('swef3: ', dateString);
      if(dateString.includes('to')) {
        const dateArray = dateString.split('to');
        dateString = formatDate(new Date(dateArray[0])) + ' to ' + formatDate(new Date(dateArray[1]));
      } else {
        dateString = formatDate(new Date(dateString));
      }
      console.log('swef4: ', dateString);
      return {
        ...drop,
        dateString: dateString,
      };
    });

    //preint everything in griddata
    console.log('swefgridData: ', gridData);

    return gridData.slice(
      curPage * selectedFilters.pageSize,
      (curPage + 1) * selectedFilters.pageSize,
    );
  };

  return (
    <Box p="10">
      <ChakraImage alt={banner} height="300" objectFit="cover" src={banner} width="100%" />
      <Heading py="4">Browse Events</Heading>

      <Show above="md">
        <HStack alignItems="center" display="flex" spacing="auto">
          <HStack align="center" justify="space-between" w="full">
            <InputGroup width="300px">
              <InputLeftElement height="56px" pointerEvents="none">
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
                height="52px"
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
              <DateRangePicker
                endDate={selectedFilters.endDate}
                endDateId="your_unique_end_date_id"
                focusedInput={focusedInput}
                format="MM/dd/yyyy HH:mm"
                hideKeyboardShortcutsPanel={true}
                showClearDates={true}
                startDate={selectedFilters.startDate}
                startDateId="your_unique_start_date_id"
                onDatesChange={({ startDate, endDate }) => {
                  setSelectedFilters((prevFilters) => ({
                    ...prevFilters,
                    startDate,
                    endDate,
                  }));
                }}
                onFocusChange={(focusedInput) => {
                  setFocusedInput(focusedInput);
                }}
              />
              <Menu>
                {({ isOpen }) => (
                  <Box>
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={`Price: ${selectedFilters.price}`}
                      variant="secondary"
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{priceMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Box w="260px">
                <Flex justifyContent="flex-end">
                  {(!isAllDropsLoading && (
                    <Menu>
                      {({ isOpen }) => (
                        <HStack>
                          <DropDownButton
                            isOpen={isOpen}
                            placeholder={`Sort: ${selectedFilters.sort}`}
                            variant="secondary"
                            onClick={() => (popoverClicked.current += 1)}
                          />
                          <MenuList minWidth="auto">{sortOrderMenuItems}</MenuList>
                        </HStack>
                      )}
                    </Menu>
                  )) || (
                    <HStack>
                      <Skeleton></Skeleton>
                      <Button
                        isLoading
                        h="52px"
                        loadingText="Loading..."
                        spinnerPlacement="end"
                        variant="secondary"
                        w="full"
                      >
                        Sort
                      </Button>
                    </HStack>
                  )}
                </Flex>
              </Box>
            </HStack>
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Menu */}
      <Hide above="md">
        <VStack spacing="20px">
          <Heading size="2xl" textAlign="left" w="full">
            All drops
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <FilterOptionsMobileButton
              buttonTitle="Filter Options"
              popoverClicked={popoverClicked}
              onOpen={onOpen}
            />
            <DateRangePicker
              endDate={selectedFilters.endDate}
              endDateId="your_unique_end_date_id"
              focusedInput={focusedInput}
              format="MM/dd/yyyy HH:mm"
              hideKeyboardShortcutsPanel={true}
              numberOfMonths={1}
              startDate={selectedFilters.startDate}
              startDateId="your_unique_start_date_id"
              onDatesChange={({ startDate, endDate }) => {
                setSelectedFilters((prevFilters) => ({
                  ...prevFilters,
                  startDate,
                  endDate,
                }));
              }}
              onFocusChange={(focusedInput) => {
                setFocusedInput(focusedInput);
              }}
            />
          </HStack>
        </VStack>
      </Hide>

      {/* Mobile Popup Menu For Filtering */}
      <MobileDrawerMenu
        filters={[
          {
            label: 'Price',
            value: selectedFilters.price,
            menuItems: priceMenuItems,
          },
          {
            label: 'Sort',
            value: selectedFilters.sort,
            menuItems: sortOrderMenuItems,
          },
        ]}
        handleKeyDown={handleKeyDown}
        handleSearchChange={handleSearchChange}
        isOpen={isOpen}
        searchTerm={searchTerm}
        title="Filter Options"
        onClose={onClose}
      />

      <GalleryGrid data={getGalleryGridRows()} loading={isLoading} />

      <DropManagerPagination
        curPage={curPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        hasPagination={hasPagination}
        isLoading={isAllDropsLoading}
        numPages={numPages}
        pageSizeMenuItems={pageSizeMenuItems}
        rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
        type={'Events'}
        onClickRowsSelect={() => (popoverClicked.current += 1)}
      />
    </Box>
  );
}
