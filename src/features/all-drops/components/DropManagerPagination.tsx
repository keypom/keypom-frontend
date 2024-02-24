import { Box, HStack, Menu, MenuList, Show, Heading, Skeleton } from '@chakra-ui/react';
import { type ReactElement } from 'react';

import { NextButton, PrevButton } from '@/components/Pagination';

import { DropDownButton } from './DropDownButton';

interface DropManagerPaginationProps {
  isLoading: boolean;
  hasPagination: boolean;
  pageSizeMenuItems: ReactElement[];
  onClickRowsSelect: () => void;
  rowsSelectPlaceholder: string;
  curPage: number;
  numPages: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export const DropManagerPagination = ({
  isLoading,
  hasPagination,
  pageSizeMenuItems,
  onClickRowsSelect,
  rowsSelectPlaceholder,
  curPage,
  numPages,
  handleNextPage,
  handlePrevPage,
}: DropManagerPaginationProps) => {
  if (isLoading) {
    // Render Skeleton loaders while content is loading
    return (
      <HStack justify="space-between" py="4" w="full">
        <Skeleton height="20px" w="120px" />
        <Skeleton height="20px" w="80px" />
      </HStack>
    );
  }
  return hasPagination ? (
    <HStack justify="space-between" py="4" w="full">
      <HStack>
        <Show above="sm">
          <Heading color="gray.500" fontWeight="normal" size="sm">
            Rows per page
          </Heading>
        </Show>
        <Show below="sm">
          <Heading color="gray.500" fontWeight="normal" size="sm">
            Rows
          </Heading>
        </Show>
        <Menu>
          {({ isOpen }) => (
            <Box>
              <DropDownButton
                isOpen={isOpen}
                placeholder={rowsSelectPlaceholder}
                variant="secondary"
                onClick={onClickRowsSelect}
              />
              <MenuList minWidth="auto">{pageSizeMenuItems}</MenuList>
            </Box>
          )}
        </Menu>
      </HStack>
      <HStack>
        <Heading color="gray.500" fontWeight="normal" size="sm">
          {curPage + 1} of {numPages === 0 ? 1 : numPages}
        </Heading>
        <PrevButton
          id="all-drops"
          isDisabled={curPage === 0}
          lineHeight=""
          variant="secondary"
          onClick={handlePrevPage}
        />
        <NextButton
          id="all-drops"
          isDisabled={curPage === numPages - 1}
          lineHeight=""
          variant="secondary"
          onClick={handleNextPage}
        />
      </HStack>
    </HStack>
  ) : null;
};
