import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

type Props = {
  product: Product;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  const renderPriceSection = () => {
    if (product.on_discount && product.original_price) {
      return (
        <View style={[styles(colors).discountContainer, { backgroundColor: colors.warning + '20' }]}>
          <Text style={[styles(colors).saleBadge, { backgroundColor: colors.error, color: colors.buttonPrimaryText }]}>
            SALE
          </Text>
          <Text style={[styles(colors).originalPrice, { color: colors.textSecondary }]}>
            {product.original_price}
          </Text>
          <Text style={[styles(colors).discountedPrice, { color: colors.error }]}>
            {product.price}
          </Text>
          {product.discount_action ? (
            <Text style={[styles(colors).discountAction, { color: colors.text }]}>
              {product.discount_action}
            </Text>
          ) : null}
          {product.discount_date ? (
            <Text style={[styles(colors).discountDate, { color: colors.textSecondary }]}>
              {product.discount_date}
            </Text>
          ) : null}
        </View>
      );
    }

    if (!product.on_discount && product.discount_action) {
      return (
        <View style={[styles(colors).promotionContainer, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles(colors).priceText, { color: colors.text }]}>
            {t('product.price', { price: product.price })}
          </Text>
          <Text style={[styles(colors).promotionText, { color: colors.primary }]}>
            {product.discount_action}
          </Text>
        </View>
      );
    }

    return (
      <Text style={[styles(colors).priceText, { color: colors.text }]}>
        {t('product.price', { price: product.price })}
      </Text>
    );
  };

  return (
    <View style={[styles(colors).card, { backgroundColor: colors.cardBackground, shadowColor: colors.cardShadow }]}>
      <View style={[styles(colors).imageContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles(colors).image} resizeMode="contain" />
        ) : (
          <View style={styles(colors).placeholder}>
            <Text style={[styles(colors).placeholderText, { color: colors.textSecondary }]}>
              No Image
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles(colors).title, { color: colors.text }]}>{product.title}</Text>
      <Text style={[styles(colors).supermarket, { color: colors.textSecondary }]}>
        {t('product.supermarket', { name: product.supermarket })}
      </Text>
      {renderPriceSection()}
      {product.size && product.size !== 'N/A' ? (
        <Text style={[styles(colors).size, { color: colors.textSecondary }]}>
          {t('product.size', { size: product.size })}
        </Text>
      ) : null}
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    imageContainer: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      padding: 10,
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontStyle: 'italic',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
    },
    supermarket: {
      fontSize: 14,
      marginBottom: 12,
    },
    discountContainer: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    saleBadge: {
      alignSelf: 'flex-start',
      fontWeight: '700',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 8,
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      marginBottom: 4,
    },
    discountedPrice: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 6,
    },
    discountAction: {
      fontWeight: '500',
    },
    discountDate: {
      marginTop: 4,
    },
    promotionContainer: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    promotionText: {
      fontWeight: '600',
      marginTop: 4,
    },
    priceText: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 12,
    },
    size: {
      fontSize: 14,
    },
  });
