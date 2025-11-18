import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Pressable, Modal, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Typography } from "@/src/components/Typography";
import Button from "@/src/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => (currentYear - 4 + i).toString());

const OptionPicker = ({
    visible,
    data,
    onSelect,
    onClose,
    title,
}: {
    visible: boolean;
    data: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
    title: string;
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center p-6"
                onPress={onClose}>
                <View className="bg-white w-full max-h-[50%] rounded-2xl p-4 shadow-lg">
                    <Typography
                        variant="h2"
                        weight="semibold"
                        className="text-left mb-4 border-b border-gray-100 pb-2">
                        Pilih {title}
                    </Typography>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-4 border-b border-gray-100 active:bg-gray-50 rounded-lg"
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}>
                                <Typography
                                    variant="body"
                                    weight="semibold"
                                    className="text-center text-gray-800">
                                    {item}
                                </Typography>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

interface RangeSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectRange: (endDate: Date, rangeType: "week" | "month" | "year") => void;
}

const RangeSelectionModal = ({ visible, onClose, onSelectRange }: RangeSelectionModalProps) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["65%"], []);
    const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>(
        MONTHS[new Date().getMonth()] ?? "Januari"
    );
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [selectedRange, setSelectedRange] = useState<"week" | "month" | "year" | null>(null);
    const [pickerType, setPickerType] = useState<"day" | "month" | "year" | null>(null);
    useEffect(() => {
        if (visible) bottomSheetModalRef.current?.present();
        else bottomSheetModalRef.current?.dismiss();
    }, [visible]);
    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) onClose();
        },
        [onClose]
    );
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const getDaysInMonth = () => {
        const monthIndex = MONTHS.indexOf(selectedMonth);
        const year = parseInt(selectedYear);
        const daysCount = new Date(year, monthIndex + 1, 0).getDate();
        return Array.from({ length: daysCount }, (_, i) => (i + 1).toString());
    };

    const handleConfirm = () => {
        if (selectedRange) {
            const monthIndex = MONTHS.indexOf(selectedMonth);
            const endDate = new Date(parseInt(selectedYear), monthIndex, parseInt(selectedDay));
            onSelectRange(endDate, selectedRange);
            bottomSheetModalRef.current?.dismiss();
        }
    };

    return (
        <>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
                backgroundStyle={{ borderRadius: 24 }}>
                <BottomSheetView style={{ flex: 1, padding: 24 }}>
                    <Typography variant="h3" weight="semibold" className="text-center mb-6">
                        Pilih Waktu Akhir
                    </Typography>
                    <View className="flex-row justify-between mb-8 gap-2">
                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("day")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {selectedDay}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-[1.5] flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("month")}>
                            <Typography
                                variant="body"
                                weight="semibold"
                                className="text-gray-700"
                                numberOfLines={1}>
                                {selectedMonth}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>

                        <Pressable
                            className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-xl p-3 active:bg-gray-50 active:border-green-500"
                            onPress={() => setPickerType("year")}>
                            <Typography variant="body" weight="semibold" className="text-gray-700">
                                {selectedYear}
                            </Typography>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </Pressable>
                    </View>

                    <View className="border-b border-gray-200 mb-8" />

                    <Typography variant="h3" weight="semibold" className="text-center mb-2">
                        Pilih Range Data
                    </Typography>
                    <Typography variant="body" className="text-gray-500 text-center mb-6">
                        Impor data dalam range sebelum waktu akhir
                    </Typography>

                    <View className="gap-3 mb-8">
                        <Button
                            label="1 Minggu"
                            variant="secondary"
                            onPress={() => setSelectedRange("week")}
                            className={selectedRange === "week" ? "border-2 border-green-500" : ""}
                            textVariant="h3"
                            isIcon={false}
                        />

                        <Button
                            label="1 Bulan"
                            variant="secondary"
                            onPress={() => setSelectedRange("month")}
                            className={selectedRange === "month" ? "border-2 border-green-500" : ""}
                            textVariant="h3"
                            isIcon={false}
                        />

                        <Button
                            label="1 Tahun"
                            variant="secondary"
                            onPress={() => setSelectedRange("year")}
                            className={selectedRange === "year" ? "border-2 border-green-500" : ""}
                            textVariant="h3"
                            isIcon={false}
                        />
                    </View>
                    <Button
                        label="Konfirmasi"
                        variant="primary"
                        onPress={handleConfirm}
                        className={!selectedRange ? "opacity-50" : ""}
                        textVariant="h3"
                        isIcon={false}
                    />
                </BottomSheetView>
            </BottomSheetModal>

            <OptionPicker
                visible={pickerType === "day"}
                title="Tanggal"
                data={getDaysInMonth()}
                onSelect={setSelectedDay}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "month"}
                title="Bulan"
                data={MONTHS}
                onSelect={(m) => {
                    setSelectedMonth(m);
                    setSelectedDay("1");
                }}
                onClose={() => setPickerType(null)}
            />

            <OptionPicker
                visible={pickerType === "year"}
                title="Tahun"
                data={YEARS}
                onSelect={setSelectedYear}
                onClose={() => setPickerType(null)}
            />
        </>
    );
};

export default RangeSelectionModal;
