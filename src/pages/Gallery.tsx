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
import { useEffect, useRef, useState } from 'react';
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
    sort: 'no sort',
    // reversed: false,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [numOwnedDrops, setNumOwnedDrops] = useState<number>(0);
  const [filteredDataItems, setFilteredDataItems] = useState<DataItem[]>([]);
  // const [wallet, setWallet] = useState({});

  const [banner, setBanner] = useState('');

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
        search: searchTerm.toLowerCase(),
      }));
    }
  };

  const handleFiltering = async (drops) => {
    // Apply the selected filters

    drops = drops.filter((drop) => drop !== null);

    console.log('wawawdrops', drops);

    if (selectedFilters.price !== GALLERY_PRICE_ITEMS[0].label) {
      const priceFilter = selectedFilters.price;

      // Apply price filter
      drops = drops.filter((drop) => {
        let price = -1;
        for (let key in drop.prices) {
          let value = drop.prices[key];
          price = parseFloat(keypomInstance.yoctoToNear(value));
          if (priceFilter === GALLERY_PRICE_ITEMS[1].label) {
            if (price < 20) {
              return true;
            }
          } else if (priceFilter === GALLERY_PRICE_ITEMS[2].label) {
            if (price >= 20 && price < 50){
              return true;
            }
          } else if (priceFilter === GALLERY_PRICE_ITEMS[3].label) {
            if (price >= 50 && price < 100){
              return true;
            }
  
          } else if (priceFilter === GALLERY_PRICE_ITEMS[4].label) {
            if (price >= 100){
              return true;
            }
        }
        return false;
        });
        
    }

    if (selectedFilters.search.trim() !== '') {
      // Apply search filter
      drops = drops.filter((drop) => {
        return (
          drop.name.toLowerCase().includes(searchTerm) ||
          drop.description.toLowerCase().includes(searchTerm)
        );
      });
    }

    // apply start and end date filters

    if (selectedFilters.startDate !== null) {
      drops = drops.filter((drop) => {
        if (drop == undefined) return false;
        let dateString = drop.date.date;
        // take start date, check if it is a string or object
        if (typeof drop.date.date !== 'string') {
          dateString = drop.date.date.from;
        }
        const date = new Date(dateString);
        return (date >= selectedFilters.startDate.toDate());

      });
    }

    if (selectedFilters.endDate !== null) {
      drops = drops.filter((drop) => {
        if (drop == undefined) return false;
        let dateString = drop.date.date;
        // take start date, check if it is a string or object
        if (typeof drop.date.date !== 'string') {
          dateString = drop.date.date.to;
        }
        const date = new Date(dateString);
        return (date <= selectedFilters.endDate.toDate());
      });
    }

    // before returning drops, sort them if all drops are fetched
    if (selectedFilters.sort !== 'no sort') {
      if (selectedFilters.sort === 'ascending') {
        drops = drops.sort((a, b) => {
          console.log('wawadata', a);
          const availableA = a.maxTickets - a.supply;
          const availableB = b.maxTickets - b.supply;
          return availableA - availableB;
        });
      }
      if (selectedFilters.sort === 'descending') {
        drops = drops.sort((a, b) => {
          console.log('wawadata', a);
          const availableA = a.maxTickets - a.supply;
          const availableB = b.maxTickets - b.supply;
          return availableB - availableA;
        });
      }
    }

    return drops;
  };

  const formatDate = (date) => {
    // Create an instance of Intl.DateTimeFormat for formatting
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', // Full month name.
      day: 'numeric', // Numeric day of the month.
      year: 'numeric', // Numeric full year.
      // hour: 'numeric', // Numeric hour.
      // minute: 'numeric', // Numeric minute.
      // hour12: true, // Use 12-hour time.
    });
    return formatter.format(date);
  };

  const [numOwnedEvents, setNumOwnedEvents] = useState<number>(0);

  const handleGetAllEvents = async () => {
    setIsAllDropsLoading(true);
    const eventListings = await keypomInstance.GetMarketListings({
      limit: 50,
      from_index: 0,
    });

    console.log('wawaeventListings', eventListings);

    const numEvents = eventListings.length;
    setNumOwnedEvents(numEvents);

    const dropDataPromises = eventListings.map(async (event) => {
      // get metadata from drop.event_id and drop.funder_id
      const eventInfo = await keypomInstance.getEventInfo({
        accountId: event.funder_id,
        eventId: event.event_id,
      });

      // for each ticket in the event, get the supply
      let supply = 0;
      let maxTickets = 0;
      let prices = [];

      for (const [name, ticketdata] of Object.entries(event.ticket_info)) {
        console.log('wawaticket1', ticketdata);
        console.log('wawaticketname1', name);
        const thissupply = await keypomInstance.getKeySupplyForTicket(name);
        supply += thissupply;
        maxTickets += ticketdata.max_tickets;
        prices.push(ticketdata.price);
      }

      let dateString = '';
      if (eventInfo?.date) {
        dateString =
          typeof eventInfo.date.date === 'string'
            ? eventInfo.date.date
            : `${eventInfo.date.date.from} to ${eventInfo.date.date.to}`;
      }

      if (event == undefined || eventInfo == undefined) {
        return null;
      }

      const numTickets = Object.keys(event.ticket_info).length;
      const dateCreated = formatDate(new Date(parseInt(eventInfo.dateCreated)));
      console.log('navurl', String(event.funder_id) + ':' + event.event_id);
      return {
        prices,
        maxTickets,
        supply,
        location: eventInfo.location,
        dateString,
        date: eventInfo.date,
        id: event.event_id,
        name: truncateAddress(eventInfo.name, 'middle', 32),
        media: eventInfo.artwork,
        dateCreated, // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        description: truncateAddress(eventInfo.description, 'end', 128),
        eventId: event.event_id,
        navurl: String(event.funder_id) + ':' + event.event_id,
      };
    });

    let dropData = await Promise.all(dropDataPromises);

    console.log('wawadropData', dropData);

    dropData = await handleFiltering(dropData);

    // Use Promise.all to wait for all promises to resolve
    // filter out all null entries

    console.log('MEGAFILTER DATA ALL DROPS');
    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(dropDataPromises.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setIsAllDropsLoading(false);
  };

  const handleGetInitialDrops = async () => {
    // setIsLoading(true);
    // First get the total supply of drops so we know when to stop fetching
    const totalSupply = await keypomInstance.getEventSupply();

    console.log('totalSupply123todofixthis', totalSupply);

    // Loop until we have enough filtered drops to fill the page size
    let dropsFetched = 0;
    let filteredDrops: ProtocolReturnedDrop[] = [];
    while (dropsFetched < totalSupply && filteredDrops.length < selectedFilters.pageSize) {
      const eventListings = await keypomInstance.GetMarketListings({
        limit: 6,
        from_index: dropsFetched,
      });

      console.log('wawaintiitialeventListings2', eventListings);

      dropsFetched += Number(eventListings.length);

      filteredDrops = filteredDrops.concat(eventListings);
    }

    // Now, map over the filtered drops and set the data
    const dropDataPromises = filteredDrops.map(async (event) => {
      // get metadata from drop.event_id and drop.funder_id
      const eventInfo = await keypomInstance.getEventInfo({
        accountId: event.funder_id,
        eventId: event.event_id,
      });

      // for each ticket in the event, get the supply
      let supply = 0;
      let maxTickets = 0;

      for (const [name, ticketdata] of Object.entries(event.ticket_info)) {
        console.log('wawaticket1', ticketdata);
        console.log('wawaticketname1', name);
        const thissupply = await keypomInstance.getKeySupplyForTicket(name);
        supply += thissupply;
        maxTickets += ticketdata.max_tickets;
      }

      let dateString = '';
      if (eventInfo?.date) {
        dateString =
          typeof eventInfo.date.date === 'string'
            ? eventInfo.date.date
            : `${eventInfo.date.date.from} to ${eventInfo.date.date.to}`;
      }

      if (event == undefined || eventInfo == undefined) {
        return null;
      }

      const numTickets = Object.keys(event.ticket_info).length;
      const dateCreated = formatDate(new Date(parseInt(eventInfo.dateCreated)));
      console.log('navurl', String(event.funder_id) + ':' + event.event_id);
      return {
        maxTickets,
        supply,
        location: eventInfo.location,
        dateString,
        date: eventInfo.date,
        id: event.event_id,
        name: truncateAddress(eventInfo.name, 'middle', 32),
        media: eventInfo.artwork,
        dateCreated, // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        description: truncateAddress(eventInfo.description, 'end', 128),
        eventId: event.event_id,
        navurl: String(event.funder_id) + ':' + event.event_id,
      };
    });

    // filter out all null entries
    // Use Promise.all to wait for all promises to resolve
    let dropData = await Promise.all(dropDataPromises);
    // filter out all null entries
    dropData = dropData.filter((drop) => drop !== null);

    if (filteredDataItems.length === 0) {
      // not actually filtered lol
      setFilteredDataItems(dropData);
    }
    setCurPage(0);
    setIsLoading(false);
  };

  useEffect(() => {
    if (filteredDataItems.length == 0 || banner !== '') return;
    const randomElement = filteredDataItems[Math.floor(Math.random() * filteredDataItems.length)];

    setBanner(randomElement.media);
  }, [filteredDataItems]);

  useEffect(() => {
    console.log('gonna call handlegetinitialdrops');

    if (keypomInstance == undefined) return;
    // First get enough data with the current filters to fill the page size
    handleGetInitialDrops();
  }, [keypomInstance]);

  useEffect(() => {
    console.log('gonna call handleGetAllEvents');
    if (keypomInstance == undefined) return;
    // In parallel, fetch all the events
    handleGetAllEvents();
  }, [selectedFilters, keypomInstance]);

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
    console.log('filteredDataItems', filteredDataItems);
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];

    let gridData = filteredDataItems;
    // fix dates here and then pass them to the gallerygrid
    // turn these into nice bois
    // map over the filtered drops and clean the date
    gridData = gridData.map((drop) => {
      let dateString = drop.dateString;
      if (drop.dateString == undefined) {
        dateString = drop.date.date;
        if (typeof drop.date.date !== 'string') {
          dateString = drop.date.date.from + ' to ' + drop.date.date.to;
        }
      }

      if (dateString.includes('to')) {
        const dateArray = dateString.split('to');
        dateString =
          formatDate(new Date(dateArray[0])) + ' to ' + formatDate(new Date(dateArray[1]));
      } else {
        dateString = formatDate(new Date(dateString));
      }
      return {
        ...drop,
        dateString,
      };
    });

    // preint everything in griddata

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
                            placeholder={`Tickets: ${selectedFilters.sort}`}
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
      <Box h="100px"></Box>
    </Box>
  );
}
