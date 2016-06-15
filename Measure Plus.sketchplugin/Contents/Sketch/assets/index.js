(function(window) {
    var version = "0.0.3",
        Spec = function(options) {
            return this;
        };


    Spec.prototype.artboardList = function(artboards) {
        var jQArtboard = $("#artboard"),
            jQNavbar = $("#navbar").addClass("navoff"),
            jQSidebar = $("#sidebar").addClass("sideoff"),
            jQArtboardList = $("#artboard_list").addClass('hide').empty();

        if (!artboards) return this;
        var self = this,
            jQGroupTemplate = $("#artboard-group-template");
        jQTemplate = $("#artboard-item-template");
        jQArtboard.addClass("m");
        jQArtboardList.removeClass('hide');
        // mark
        var lastPageName = null,
            lastContainer = null;
        $.each(artboards, function(index, artboard) {
            var p = artboard.width / artboard.height,
                width = (p < 1) ? Math.round(44 * p) : 44,
                height = (p < 1) ? 44 : Math.round(44 / p);

            var jQArtboardItem = null;
            if (artboard.pageName != lastPageName) {
                jQArtboardItem = self.template(jQGroupTemplate, {
                    index: index,
                    name: artboard.pageName
                });
                jQArtboardList.append(jQArtboardItem);
                // group item
                lastContainer = $('<ul class="w-artboards"></ul>');
                jQArtboardList.append(lastContainer);
            }
            lastPageName = artboard.pageName;
            // 
            if (lastContainer) {
                jQArtboardItem = self.template(jQTemplate, {
                    index: index,
                    objectID: artboard.objectID,
                    name: artboard.name
                });
                lastContainer.append(jQArtboardItem);
            }

        });

        return this;
    };

    Spec.prototype.sliceList = function(slices) {
        if (!slices) return this;
        var jQAllSliceList = $("#slice_list").addClass('hide').empty();
        var self = this,
            jQTemplate = $("#slice-item-template");

        $.each(slices, function(index, slice) {
            var preview = {};
            var jQDownloads = [];
            preview.objectID = slice.objectID;
            preview.name = slice.name;
            preview.scale = 0;
            preview.sliceName = "";
            preview.width = "auto";
            preview.height = "auto";

            $.each(slice.exportSizes, function(index, exportSize) {
                if (preview.scale < exportSize.scale) {
                    preview.scale = exportSize.scale;
                    preview.sliceName = exportSize.sliceName;
                }
                jQDownloads.push(self.template($("#slice-template"), { scale: exportSize.scale + "x", sliceName: exportSize.sliceName, fileName: exportSize.sliceName.replace("slices/", "") }));
            });

            var width = Math.round(slice.rect.width / preview.scale);
            var height = Math.round(slice.rect.height / preview.scale);
            var p = width / height;

            if (p < 1) {
                preview.height = (height > 38) ? "38px" : height + "px";
            } else {
                preview.width = (width > 38) ? "38px" : width + "px";
            }

            var jQSliceItem = self.template(jQTemplate, preview);
            var jQSliceDownload = jQSliceItem.find(".s-name");
            jQSliceDownload.append(jQDownloads);
            jQAllSliceList.append(jQSliceItem);
        });
        return this;
    };

    Spec.prototype.events = function() {
        // toggle goup
        var groups = $('.a-group');
        groups.click(function(event) {
            var target = event.target;
            var self = $(target);
            self.next('.w-artboards').toggle();
        });
        //
        var links = $('.w-item .a-name');
        links.click(function(event) {
            var target = event.target;
            var self = $(target);

            links.removeClass('a-name-selected');
            self.addClass('a-name-selected');
        });
        //tabs
        var jQTabs = $("#tabs .a-tab");
        jQTabs.click(function(event) {
            var target = event.target;
            var self = $(target);

            jQTabs.removeClass('current');
            self.addClass('current');

            var tabName = self.attr('data-tab');
            $.each(['artboard_list', 'slice_list'], function(idx, item) {
                if (item == tabName) {
                    $('#' + item).removeClass('hide');
                } else {
                    $('#' + item).addClass('hide');
                }
            });
        });
    }

    Spec.prototype.template = function(template, model) {
        var templateData = template.html();
        templateData = templateData.replace(new RegExp("\\$\\{([^\\}]+)\\}", "gi"), function($0, $1) {
            if ($1 in model) {
                return model[$1];
            } else {
                return $0;
            }
        });
        return $(templateData).data("model", model);
    };


    window.Index = Spec;
})(window);
