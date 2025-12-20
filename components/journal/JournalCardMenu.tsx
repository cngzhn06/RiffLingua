import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/colors';

interface JournalCardMenuProps {
  onDelete: () => void;
  onEdit: () => void;
}

export default function JournalCardMenu({ onDelete, onEdit }: JournalCardMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: onDelete
        }
      ]
    );
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit();
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleEdit}
            >
              <Text style={styles.menuItemIcon}>✏️</Text>
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.deleteItem]}
              onPress={handleDelete}
            >
              <Text style={styles.menuItemIcon}>🗑️</Text>
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  deleteItem: {
    // Kırmızı vurgu için
  },
  deleteText: {
    color: Colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundDark,
  },
});

