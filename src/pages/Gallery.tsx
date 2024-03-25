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

import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import {
  GALLERY_PRICE_ITEMS,
  GALLERY_PAGE_SIZE_ITEMS,
  SORT_MENU_ITEMS,
  createMenuItems,
} from '@/features/all-drops/config/menuItems';
import keypomInstance, { type MarketListing } from '@/lib/keypom';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';
import { FilterOptionsMobileButton } from '@/features/all-drops/components/FilterOptionsMobileButton';
import { MobileDrawerMenu } from '@/features/all-drops/components/MobileDrawerMenu';
import { truncateAddress } from '@/utils/truncateAddress';
import { FormControlComponent } from '@/components/FormControl';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';
import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';
import { type FunderEventMetadata, type DateAndTimeInfo } from '@/lib/eventsHelpers';

// import myData from '../data/db.json';

// props validation
// Gallery.propTypes = {
//   isSecondary: PropTypes.bool,
// };

export default function Gallery() {
  // const isSecondary = props.isSecondary || false;
  // pagination
  // const [hasPagination, setHasPagination] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isAllDropsLoading, setIsAllDropsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // date range picker
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePlaceholder, setDatePlaceholder] = useState('Select date and time');
  const margins = '0 !important';

  const datePickerCTA = (
    // formData.date.error
    <FormControlComponent errorText="" label="" my={margins}>
      <Input
        readOnly
        backgroundColor="white"
        border="2px solid"
        borderColor="gray.200"
        color="gray.400"
        fontSize="md"
        fontWeight="medium"
        height="52px"
        isInvalid={false} //! !formData.date.error
        m="0"
        placeholder={datePlaceholder}
        px="6"
        style={{ cursor: 'pointer' }}
        sx={{
          '::placeholder': {
            color: 'gray.400',
          },
        }}
        onClick={() => {
          setIsDatePickerOpen(true);
        }}
      />
    </FormControlComponent>
  );

  const [selectedFilters, setSelectedFilters] = useState<{
    // type: string;
    search: string;
    pageSize: number;
    price: string;
    eventDate: DateAndTimeInfo;
    sort: string;
    // reversed: boolean;
  }>({
    // type: DROP_TYPE_OPTIONS.ANY,
    search: '',
    pageSize: parseInt(GALLERY_PAGE_SIZE_ITEMS[0].label),
    price: GALLERY_PRICE_ITEMS[0].label,
    eventDate: { startDate: 0 },
    sort: 'no sort',
    // reversed: false,
  });

  useEffect(() => {
    if (selectedFilters.eventDate === undefined) return;
    const datePlaceholder = dateAndTimeToText(selectedFilters.eventDate, 'Filter by Date');

    setDatePlaceholder(datePlaceholder);
  }, [selectedFilters.eventDate]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [numOwnedDrops, setNumOwnedDrops] = useState<number>(0);
  const [filteredDataItems, setFilteredDataItems] = useState<any[]>([]);
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

    if (selectedFilters.price !== GALLERY_PRICE_ITEMS[0].label) {
      const priceFilter = selectedFilters.price;

      // Apply price filter
      drops = drops.filter((drop) => {
        let price = -1;
        for (const key in drop.prices) {
          const value = drop.prices[key];
          price = parseFloat(keypomInstance.yoctoToNear(value));
          if (priceFilter === GALLERY_PRICE_ITEMS[1].label) {
            if (price < 20) {
              return true;
            }
          } else if (priceFilter === GALLERY_PRICE_ITEMS[2].label) {
            if (price >= 20 && price < 50) {
              return true;
            }
          } else if (priceFilter === GALLERY_PRICE_ITEMS[3].label) {
            if (price >= 50 && price < 100) {
              return true;
            }
          } else if (priceFilter === GALLERY_PRICE_ITEMS[4].label) {
            if (price >= 100) {
              return true;
            }
          }
        }
        return false;
      });
    }

    if (selectedFilters.search.trim() !== '') {
      // Apply search filter
      drops = drops.filter((drop) => {
        return (
          drop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drop.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // apply start and end date filters

    if (
      selectedFilters.eventDate.startDate !== null &&
      selectedFilters.eventDate.startDate !== undefined &&
      selectedFilters.eventDate.startDate !== 0
    ) {
      drops = drops.filter((drop) => {
        if (drop === undefined) return false;

        return (
          selectedFilters.eventDate.startDate !== null &&
          drop.date.startDate >= selectedFilters.eventDate.startDate
        );
      });
    }

    if (
      selectedFilters.eventDate?.endDate !== null &&
      selectedFilters.eventDate?.endDate !== undefined &&
      selectedFilters.eventDate?.endDate !== 0
    ) {
      drops = drops.filter((drop) => {
        if (drop === undefined) return false;

        if (selectedFilters.eventDate.endDate === undefined) return false;

        return (
          selectedFilters.eventDate.endDate !== null &&
          drop.date.endDate <= selectedFilters.eventDate.endDate
        );
      });
    }

    // before returning drops, sort them if all drops are fetched
    if (selectedFilters.sort !== 'no sort') {
      if (selectedFilters.sort === 'ascending') {
        drops = drops.sort((a, b) => {
          const availableA = a.maxTickets - a.supply;
          const availableB = b.maxTickets - b.supply;
          return availableA - availableB;
        });
      }
      if (selectedFilters.sort === 'descending') {
        drops = drops.sort((a, b) => {
          const availableA = a.maxTickets - a.supply;
          const availableB = b.maxTickets - b.supply;
          return availableB - availableA;
        });
      }
    }

    return drops;
  };

  useEffect(() => {
    // in the rare case that initial is loaded after all, load all again
    if (!isAllDropsLoading && isLoading) {
      handleGetAllMarketListings();
    }
  }, [filteredDataItems]);

  const handleGetAllMarketListings = async () => {
    setIsAllDropsLoading(true);
    // First get the total supply of drops so we know when to stop fetching

    const allEventListings: MarketListing[] = await keypomInstance.GetMarketListings({
      limit: 0, // no limit
      start: 0,
    });

    const dropDataPromises = allEventListings.map(async (event: MarketListing) => {
      // get metadata from drop.event_id and drop.funder_id
      const eventInfo: FunderEventMetadata | null = await keypomInstance.getEventInfo({
        accountId: event.funder_id,
        eventId: event.event_id,
      });

      // filter out events with null info
      if (eventInfo === null) {
        return null;
      }

      // for each ticket in the event, get the supply
      let supply = 0;
      let maxTickets = 0;
      const prices: number[] = [];

      for (const [name, ticketdata] of Object.entries(event.ticket_info)) {
        const thissupply = await keypomInstance.getKeySupplyForTicket(name);
        const ticketData = ticketdata;
        supply += parseInt(thissupply);
        maxTickets += ticketData.max_tickets;
        prices.push(ticketData.price);
      }

      let dateString = '';
      if (eventInfo?.date != null) {
        dateString = dateAndTimeToText(eventInfo.date);
      }

      if (event === undefined || eventInfo === undefined) {
        return null;
      }

      let endDate = new Date();
      if (eventInfo.date.endDate != null) {
        endDate = new Date(eventInfo.date.endDate);
      } else {
        endDate = new Date(eventInfo.date.startDate);
      }

      const numTickets = Object.keys(event.ticket_info).length;
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
        dateCreated: eventInfo.dateCreated,
        numTickets,
        description: truncateAddress(eventInfo.description, 'end', 128),
        eventId: event.event_id,
        dateForPastCheck: endDate,
        navurl: String(event.funder_id) + ':' + String(event.event_id),
      };
    });

    let dropData = await Promise.all(dropDataPromises);

    dropData = await handleFiltering(dropData);

    // Use Promise.all to wait for all promises to resolve
    // filter out all null entries

    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(dropData.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setIsAllDropsLoading(false);
  };

  const handleGetInitialMarketListings = async () => {
    // setIsLoading(true);
    // Get enough filtered drops to fill the page size
    const marketListings: MarketListing[] = await keypomInstance.GetMarketListings({
      limit: selectedFilters.pageSize,
      start: 0,
    });

    // Now, map over the filtered drops and set the data
    const dropDataPromises = marketListings.map(async (event: MarketListing) => {
      // get metadata from drop.event_id and drop.funder_id
      const eventInfo = await keypomInstance.getEventInfo({
        accountId: event.funder_id,
        eventId: event.event_id,
      });

      // for each ticket in the event, get the supply
      let supply = 0;
      let maxTickets = 0;

      for (const [name, ticketdata] of Object.entries(event.ticket_info) as [string, any]) {
        const thissupply = await keypomInstance.getKeySupplyForTicket(name);
        supply += parseInt(thissupply);
        maxTickets += parseInt(ticketdata.max_tickets);
      }

      let dateString = '';
      if (eventInfo?.date != null) {
        dateString = dateAndTimeToText(eventInfo.date);
      }

      if (event == null || event === undefined || eventInfo == null || eventInfo === undefined) {
        return null;
      }

      const numTickets = Object.keys(event.ticket_info).length;
      return {
        maxTickets,
        supply,
        location: eventInfo.location,
        dateString,
        date: eventInfo.date,
        id: event.event_id,
        name: truncateAddress(eventInfo.name, 'middle', 32),
        media: eventInfo.artwork,
        dateCreated: eventInfo.dateCreated, // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        description: truncateAddress(eventInfo.description, 'end', 128),
        eventId: event.event_id,
        navurl: String(event.funder_id) + ':' + String(event.event_id),
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
    if (filteredDataItems.length === 0 || banner !== '') return;
    const randomElement = filteredDataItems[Math.floor(Math.random() * filteredDataItems.length)];

    setBanner(randomElement.media);
  }, [filteredDataItems]);

  useEffect(() => {
    if (keypomInstance === undefined) return;
    // First get enough data with the current filters to fill the page size
    handleGetInitialMarketListings();
  }, [keypomInstance]);

  useEffect(() => {
    if (keypomInstance === undefined) return;
    // In parallel, fetch all the events
    handleGetAllMarketListings();
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
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];

    const gridData = filteredDataItems;

    return gridData.slice(
      curPage * selectedFilters.pageSize,
      (curPage + 1) * selectedFilters.pageSize,
    );
  };

  return (
    <Box p="10">
      {banner === '' ? (
        <Skeleton height="300px" width="100%" />
      ) : (
        <ChakraImage alt={banner} height="300" objectFit="cover" src={banner} width="100%" />
      )}
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
              <CustomDateRangePicker
                ctaComponent={datePickerCTA}
                endDate={selectedFilters.eventDate.endDate}
                // endTime={selectedFilters.eventDate.endTime}
                isDatePickerOpen={isDatePickerOpen}
                maxDate={null}
                minDate={new Date()}
                setIsDatePickerOpen={setIsDatePickerOpen}
                startDate={selectedFilters.eventDate.startDate}
                //  startTime={selectedFilters.eventDate.startTime}
                onDateChange={(startDate, endDate) => {
                  setSelectedFilters((prevFilters) => ({
                    ...prevFilters,
                    eventDate: {
                      ...prevFilters.eventDate,
                      startDate,
                      endDate,
                    },
                  }));
                }}
                onTimeChange={(startTime, endTime) => {
                  setSelectedFilters((prevFilters) => ({
                    ...prevFilters,
                    eventDate: {
                      ...prevFilters.eventDate,
                      startTime,
                      endTime,
                    },
                  }));
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
                  {!isAllDropsLoading && (
                    <Menu>
                      {({ isOpen }) => (
                        <Box>
                          <DropDownButton
                            isOpen={isOpen}
                            placeholder={`Tickets: ${selectedFilters.sort}`}
                            variant="secondary"
                            onClick={() => (popoverClicked.current += 1)}
                          />
                          <MenuList minWidth="auto">{sortOrderMenuItems}</MenuList>
                        </Box>
                      )}
                    </Menu>
                  )}
                  {isAllDropsLoading && (
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
          </HStack>

          <CustomDateRangePickerMobile
            ctaComponent={datePickerCTA}
            endDate={selectedFilters.eventDate.endDate}
            // endTime={selectedFilters.eventDate.endTime}
            isDatePickerOpen={isDatePickerOpen}
            maxDate={null}
            minDate={new Date()}
            openDirection="top-start"
            setIsDatePickerOpen={setIsDatePickerOpen}
            startDate={selectedFilters.eventDate.startDate}
            // startTime={selectedFilters.eventDate.startTime}
            onDateChange={(startDate, endDate) => {
              setSelectedFilters((prevFilters) => ({
                ...prevFilters,
                eventDate: {
                  ...prevFilters.eventDate,
                  startDate,
                  endDate,
                },
              }));
            }}
            onTimeChange={(startTime, endTime) => {
              setSelectedFilters((prevFilters) => ({
                ...prevFilters,
                eventDate: {
                  ...prevFilters.eventDate,
                  startTime,
                  endTime,
                },
              }));
            }}
          />
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
